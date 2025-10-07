"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import enemyShipPositions from "./not-found/enemy-ship-positions.json";
import Button from "@/components/Button";

type Vector2 = { x: number; y: number };
type Bullet = {
  id: string;
  position: Vector2;
  velocityX?: number;
  velocityY: number;
  width: number;
  height: number;
  color: string;
};
type Enemy = {
  id: string;
  position: Vector2;
  velocity: Vector2;
  width: number;
  height: number;
  alive: boolean;
  shootCooldownMs: number;
  color: string;
};
type Explosion = {
  x: number;
  y: number;
  ageMs: number;
  durationMs: number;
  maxRadius: number;
};

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 560; // canvas drawing height
const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 20;
const PLAYER_BOTTOM_MARGIN = 64; // 4rem spacing from bottom of viewport/canvas
const PLAYER_SPEED = 4.5;
const PLAYER_COLOR = "#ffffff";
const ENEMY_COLOR = "#ffffff";
const BG_COLOR = "#000000";
const LASER_COLOR = "#ffffff";
const ENEMY_BULLET_SPEED = 2.0; // slower magnitude per frame (aimed toward player)
const PLAYER_BULLET_SPEED = -7.2;
const COLLISION_PADDING = 2;

// Grid overlay config from JSON (force 22 columns: A..V)
const GRID_COLS = (enemyShipPositions as { columns: number }).columns - 2;
const GRID_ROWS = (enemyShipPositions as { rows: number }).rows;
const GRID_CELL_SIZE = 24; // px
const GRID_GAP = 4; // px

// Build mask from JSON coordinates like "G2"
const FOUR_ZERO_FOUR_MASK: boolean[][] = (() => {
  const rows = GRID_ROWS;
  const cols = GRID_COLS;
  const mask: boolean[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => false)
  );
  const colLetterToIndex = (letter: string) =>
    letter.toUpperCase().charCodeAt(0) - 65; // 'A' -> 0
  const { active_ships } = enemyShipPositions as { active_ships: string[][] };
  for (const group of active_ships) {
    for (const coord of group) {
      const col = colLetterToIndex(coord[0]);
      const row = Number(coord.slice(1)) - 1; // 1-indexed to 0-indexed
      if (row >= 0 && row < rows && col >= 0 && col < cols) {
        mask[row][col] = true;
      }
    }
  }
  return mask;
})();

const clamp = (value: number, min: number, max: number) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

const rectsOverlap = (
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number }
) => {
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  );
};

const randomId = () => Math.random().toString(36).slice(2);

// Draw a rounded rectangle matching Tailwind `rounded-sm`
const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) => {
  const radius = Math.max(0, Math.min(r, Math.min(w, h) / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.arcTo(x + w, y, x + w, y + radius, radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
  ctx.lineTo(x + radius, y + h);
  ctx.arcTo(x, y + h, x, y + h - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
};

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const [hasStarted, setHasStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  // Charge shot state
  const isChargingRef = useRef<boolean>(false);
  const chargeStartTsRef = useRef<number>(0);
  const chargeProgressRef = useRef<number>(0); // 0..1

  // Player state
  const playerRef = useRef<{
    position: Vector2;
    width: number;
    height: number;
  } | null>(null);
  const inputRef = useRef<{
    left: boolean;
    right: boolean;
    shootHeld: boolean;
  }>({ left: false, right: false, shootHeld: false });
  const playerBulletsRef = useRef<Bullet[]>([]);

  // Enemies
  const enemiesRef = useRef<Enemy[]>([]);
  const enemyBulletsRef = useRef<Bullet[]>([]);
  const explosionsRef = useRef<Explosion[]>([]);

  // Timing
  const lastFrameTimeRef = useRef<number>(0);
  const playerShootCooldownRef = useRef<number>(0);

  // Derived layout
  const gridPixelWidth =
    GRID_COLS * GRID_CELL_SIZE + (GRID_COLS - 1) * GRID_GAP;
  const gridPixelHeight =
    GRID_ROWS * GRID_CELL_SIZE + (GRID_ROWS - 1) * GRID_GAP;
  const gridOffsetX = (CANVAS_WIDTH - gridPixelWidth) / 2;
  const gridOffsetY = 60;

  const initializePlayer = useCallback(() => {
    playerRef.current = {
      position: {
        x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
        y: CANVAS_HEIGHT - PLAYER_BOTTOM_MARGIN - PLAYER_HEIGHT,
      },
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
    };
    playerBulletsRef.current = [];
    playerShootCooldownRef.current = 0;
  }, []);

  const buildEnemiesFromMask = useCallback(
    (currentLevel: number) => {
      const enemies: Enemy[] = [];
      const speedScale = 1 + (currentLevel - 1) * 0.2;
      for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
          if (!FOUR_ZERO_FOUR_MASK[row]?.[col]) continue; // inactive, stays as backdrop only
          // Position enemies to exactly match active grid cells
          const x = gridOffsetX + col * (GRID_CELL_SIZE + GRID_GAP);
          const y = gridOffsetY + row * (GRID_CELL_SIZE + GRID_GAP);
          enemies.push({
            id: randomId(),
            position: { x, y },
            velocity: {
              x: (Math.random() > 0.5 ? 1 : -1) * speedScale * 0.7,
              y: speedScale * 0.2,
            },
            width: GRID_CELL_SIZE,
            height: GRID_CELL_SIZE,
            alive: true,
            shootCooldownMs: 1000 + (Math.random() * 1800) / speedScale,
            color: ENEMY_COLOR,
          });
        }
      }
      enemiesRef.current = enemies;
      enemyBulletsRef.current = [];
    },
    [gridOffsetX, gridOffsetY]
  );

  const resetGame = useCallback(
    (nextLevel?: number) => {
      setIsGameOver(false);
      setIsVictory(false);
      if (typeof nextLevel === "number") setLevel(nextLevel);
      initializePlayer();
      buildEnemiesFromMask(typeof nextLevel === "number" ? nextLevel : level);
    },
    [buildEnemiesFromMask, initializePlayer, level]
  );

  useEffect(() => {
    initializePlayer();
    buildEnemiesFromMask(level);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") inputRef.current.left = true;
      if (e.key === "ArrowRight") inputRef.current.right = true;
      if (e.code === "Space") {
        e.preventDefault();
        if (!isChargingRef.current) {
          isChargingRef.current = true;
          chargeStartTsRef.current = performance.now();
        }
        inputRef.current.shootHeld = true;
        if (!hasStarted && !isGameOver) setHasStarted(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") inputRef.current.left = false;
      if (e.key === "ArrowRight") inputRef.current.right = false;
      if (e.code === "Space") {
        inputRef.current.shootHeld = false;
        // Release charge: decide tap vs burst
        if (isChargingRef.current) {
          const heldMs = performance.now() - chargeStartTsRef.current;
          const clamped = Math.min(3000, Math.max(0, heldMs));
          const TAP_THRESHOLD_MS = 150; // quick tap threshold
          if (clamped < TAP_THRESHOLD_MS) {
            shootPlayerBullet();
          } else {
            const shots = Math.max(
              3,
              Math.min(10, Math.round((clamped / 3000) * 10))
            );
            shootBurst(shots);
          }
          isChargingRef.current = false;
          chargeProgressRef.current = 0;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [hasStarted, isGameOver]);

  const shootPlayerBullet = useCallback(() => {
    if (!playerRef.current) return;
    if (playerShootCooldownRef.current > 0) return;
    const bullet: Bullet = {
      id: randomId(),
      position: {
        x: playerRef.current.position.x + PLAYER_WIDTH / 2 - 1,
        y: playerRef.current.position.y - 8,
      },
      velocityX: 0,
      velocityY: PLAYER_BULLET_SPEED,
      width: 2,
      height: 8,
      color: LASER_COLOR,
    };
    playerBulletsRef.current = [...playerBulletsRef.current, bullet];
    playerShootCooldownRef.current = 160; // ms
  }, []);

  const shootBurst = useCallback((count: number) => {
    const player = playerRef.current;
    if (!player) return;
    const centerX = player.position.x + PLAYER_WIDTH / 2 - 1;
    const centerY = player.position.y - 8;
    // Spread over 60 degrees (±30) upwards
    const startDeg = -90 - 30;
    const endDeg = -90 + 30;
    const n = Math.max(1, Math.min(10, count));
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0.5 : i / (n - 1);
      const deg = startDeg + (endDeg - startDeg) * t;
      const rad = (deg * Math.PI) / 180;
      const speed = 8; // faster burst shots
      const vx = Math.cos(rad) * speed;
      const vy = Math.sin(rad) * speed; // negative y goes up
      const bullet: Bullet = {
        id: randomId(),
        position: { x: centerX, y: centerY },
        velocityX: vx,
        velocityY: vy,
        width: 2,
        height: 8,
        color: LASER_COLOR,
      };
      playerBulletsRef.current.push(bullet);
    }
  }, []);

  const enemiesShoot = useCallback((dtMs: number) => {
    // Global limits so only a few enemies shoot and fewer bullets exist on screen
    const MAX_ENEMY_BULLETS_ON_SCREEN = 6;
    const MAX_ENEMY_SHOOTERS_PER_TICK = 2;

    if (enemyBulletsRef.current.length >= MAX_ENEMY_BULLETS_ON_SCREEN) return;

    const aliveEnemies = enemiesRef.current.filter((e) => e.alive);
    // Shuffle a shallow copy to randomize shooters each frame
    const shuffled = [...aliveEnemies].sort(() => Math.random() - 0.5);
    let shootersRemaining = MAX_ENEMY_SHOOTERS_PER_TICK;
    for (const enemy of shuffled) {
      if (shootersRemaining <= 0) break;
      enemy.shootCooldownMs -= dtMs;
      if (enemy.shootCooldownMs <= 0) {
        // Longer cooldowns for slower firing cadence
        enemy.shootCooldownMs = 1500 + Math.random() * 1500; // 1.5s - 3.0s
        // Respect global bullets-on-screen cap
        if (enemyBulletsRef.current.length >= MAX_ENEMY_BULLETS_ON_SCREEN)
          break;
        // Aim at the player
        const player = playerRef.current;
        const originX = enemy.position.x + enemy.width / 2 - 1;
        const originY = enemy.position.y + enemy.height + 2;
        let vx = 0;
        let vy = ENEMY_BULLET_SPEED;
        if (player) {
          const dx = player.position.x + PLAYER_WIDTH / 2 - originX;
          const dy = player.position.y - originY;
          const len = Math.hypot(dx, dy) || 1;
          vx = (dx / len) * ENEMY_BULLET_SPEED;
          vy = (dy / len) * ENEMY_BULLET_SPEED;
        }
        const bullet: Bullet = {
          id: randomId(),
          position: { x: originX, y: originY },
          velocityX: vx,
          velocityY: vy,
          width: 2,
          height: 8,
          color: LASER_COLOR,
        };
        enemyBulletsRef.current = [...enemyBulletsRef.current, bullet];
        shootersRemaining -= 1;
      }
    }
  }, []);

  const update = useCallback(
    (dtMs: number) => {
      const player = playerRef.current;
      if (!player) return;

      // Player movement
      if (inputRef.current.left) player.position.x -= PLAYER_SPEED;
      if (inputRef.current.right) player.position.x += PLAYER_SPEED;
      player.position.x = clamp(
        player.position.x,
        8,
        CANVAS_WIDTH - PLAYER_WIDTH - 8
      );

      // Player shoot (single tap) still allowed, but charging overrides burst on release
      playerShootCooldownRef.current = Math.max(
        0,
        playerShootCooldownRef.current - dtMs
      );
      if (inputRef.current.shootHeld) {
        // track charge progress for visual feedback (0..1 over 3s)
        const elapsed = performance.now() - chargeStartTsRef.current;
        chargeProgressRef.current = Math.max(0, Math.min(1, elapsed / 3000));
      }

      // Update bullets
      playerBulletsRef.current = playerBulletsRef.current
        .map((b) => ({
          ...b,
          position: {
            x: b.position.x + (b.velocityX ?? 0),
            y: b.position.y + b.velocityY,
          },
        }))
        .filter((b) => b.position.y + b.height >= 0);

      enemyBulletsRef.current = enemyBulletsRef.current
        .map((b) => ({
          ...b,
          position: {
            x: b.position.x + (b.velocityX ?? 0),
            y: b.position.y + b.velocityY,
          },
        }))
        .filter((b) => b.position.y <= CANVAS_HEIGHT + 16);

      // Enemies movement (scurry: wandering drift, bounce on edges, gentle descent)
      for (const enemy of enemiesRef.current) {
        if (!enemy.alive) continue;
        // add slight wander to horizontal velocity
        enemy.velocity.x += (Math.random() - 0.5) * 0.15;
        // clamp wander speed
        if (enemy.velocity.x > 2) enemy.velocity.x = 2;
        if (enemy.velocity.x < -2) enemy.velocity.x = -2;
        enemy.position.x += enemy.velocity.x;
        if (
          enemy.position.x <= 8 ||
          enemy.position.x + enemy.width >= CANVAS_WIDTH - 8
        ) {
          enemy.velocity.x *= -1;
          enemy.position.y += 8; // step down when bouncing
        }
        // occasional jittery step to simulate scurry
        if (Math.random() < 0.01) enemy.velocity.x *= -1;
        enemy.position.y += enemy.velocity.y * 0.03; // slight increase
      }

      // Enemy shooting
      enemiesShoot(dtMs);

      // Collisions: player bullets vs enemies
      const nextEnemies: Enemy[] = enemiesRef.current.map((e) => ({ ...e }));
      const nextPlayerBullets: Bullet[] = [];
      for (const b of playerBulletsRef.current) {
        let hit = false;
        for (const e of nextEnemies) {
          if (!e.alive) continue;
          const a = {
            x: b.position.x - COLLISION_PADDING,
            y: b.position.y - COLLISION_PADDING,
            w: b.width + COLLISION_PADDING * 2,
            h: b.height + COLLISION_PADDING * 2,
          };
          const r = {
            x: e.position.x,
            y: e.position.y,
            w: e.width,
            h: e.height,
          };
          if (rectsOverlap(a, r)) {
            e.alive = false;
            setScore((s) => s + 10);
            // pop explosion
            explosionsRef.current.push({
              x: e.position.x + e.width / 2,
              y: e.position.y + e.height / 2,
              ageMs: 0,
              durationMs: 280,
              maxRadius: 14,
            });
            hit = true;
            break;
          }
        }
        if (!hit) nextPlayerBullets.push(b);
      }
      enemiesRef.current = nextEnemies;
      playerBulletsRef.current = nextPlayerBullets;

      // Collisions: enemy bullets vs player, and enemy body vs player
      const playerRect = {
        x: player.position.x,
        y: player.position.y,
        w: PLAYER_WIDTH,
        h: PLAYER_HEIGHT,
      };
      for (const b of enemyBulletsRef.current) {
        const r = { x: b.position.x, y: b.position.y, w: b.width, h: b.height };
        if (rectsOverlap(playerRect, r)) {
          setIsGameOver(true);
          setHasStarted(false);
          return;
        }
      }
      for (const e of enemiesRef.current) {
        if (!e.alive) continue;
        const r = { x: e.position.x, y: e.position.y, w: e.width, h: e.height };
        if (rectsOverlap(playerRect, r)) {
          setIsGameOver(true);
          setHasStarted(false);
          return;
        }
        if (e.position.y + e.height >= player.position.y) {
          setIsGameOver(true);
          setHasStarted(false);
          return;
        }
      }

      // Victory
      const anyAlive = enemiesRef.current.some((e) => e.alive);
      if (!anyAlive) {
        setIsVictory(true);
        setHasStarted(false);
      }
      // Update explosions
      explosionsRef.current = explosionsRef.current
        .map((ex) => ({ ...ex, ageMs: ex.ageMs + dtMs }))
        .filter((ex) => ex.ageMs < ex.durationMs);
    },
    [enemiesShoot, shootPlayerBullet]
  );

  const drawGridOverlay = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      // no-op: overlay now rendered via DOM
    },
    [gridOffsetX, gridOffsetY]
  );

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Grid overlay moved to DOM for styled cells

      // Player
      const player = playerRef.current;
      if (player) {
        // Square player with height squish while charging
        const strokeWidth = 1;
        const inset = strokeWidth;
        const maxSquish = 8; // up to 8px reduction at full charge
        const squishY = maxSquish * chargeProgressRef.current;
        const drawH = Math.max(8, PLAYER_HEIGHT - squishY);
        const offsetY = (PLAYER_HEIGHT - drawH) / 2;
        drawRoundedRect(
          ctx,
          player.position.x + inset,
          player.position.y + inset + offsetY,
          PLAYER_WIDTH - inset * 2,
          drawH - inset * 2,
          2
        );
        ctx.fillStyle = "rgba(255,255,255,0.20)";
        ctx.fill();
        ctx.strokeStyle = PLAYER_COLOR;
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
      }

      // Enemies (only alive ones during game)
      for (const enemy of enemiesRef.current) {
        if (!enemy.alive) continue;
        // Match DOM active style exactly; draw border fully INSIDE the square
        const strokeWidth = 1;
        const inset = strokeWidth; // keep the entire stroke inside by insetting 1px on all sides
        drawRoundedRect(
          ctx,
          enemy.position.x + inset,
          enemy.position.y + inset,
          enemy.width - inset * 2,
          enemy.height - inset * 2,
          2
        );
        ctx.fillStyle = "rgba(255,255,255,0.20)";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
      }

      // Explosions (pop effect)
      for (const ex of explosionsRef.current) {
        const t = Math.max(0, Math.min(1, ex.ageMs / ex.durationMs));
        const radius = ex.maxRadius * t;
        const alpha = 1 - t;
        ctx.beginPath();
        ctx.arc(ex.x, ex.y, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = `rgba(255,255,255,${0.15 * alpha})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = 1 + 1.5 * (1 - t);
        ctx.stroke();
      }

      // Bullets
      for (const b of playerBulletsRef.current) {
        ctx.fillStyle = b.color;
        ctx.fillRect(b.position.x, b.position.y, b.width, b.height);
      }
      for (const b of enemyBulletsRef.current) {
        ctx.fillStyle = b.color;
        ctx.fillRect(b.position.x, b.position.y, b.width, b.height);
      }
    },
    [drawGridOverlay, hasStarted]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = (timestamp: number) => {
      if (lastFrameTimeRef.current === 0) lastFrameTimeRef.current = timestamp;
      const dt = timestamp - lastFrameTimeRef.current;
      lastFrameTimeRef.current = timestamp;

      if (hasStarted && !isGameOver && !isVictory) update(dt);
      draw(ctx);

      animationRef.current = window.requestAnimationFrame(loop);
    };
    animationRef.current = window.requestAnimationFrame(loop);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [draw, hasStarted, isGameOver, isVictory, update]);

  const handleStartOrRestart = useCallback(() => {
    if (isGameOver || isVictory) {
      resetGame(level);
      setHasStarted(true);
      return;
    }
    setHasStarted(true);
  }, [isGameOver, isVictory, level, resetGame]);

  const handleNextLevel = useCallback(() => {
    const next = level + 1;
    resetGame(next);
    setHasStarted(true);
  }, [level, resetGame]);

  // UI
  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-6 px-4 py-10">
      {/* Instructions below the fleet grid */}
      {!hasStarted && (
        <section className="flex w-full max-w-5xl flex-col items-center gap-6 text-center mt-6">
          <h1 className="text-3xl font-semibold tracking-tight">
            Page not found.
          </h1>
          <div className="flex flex-col items-center gap-3 text-white/80">
            <p className="text-lg">
              Press or hold{" "}
              <kbd className="rounded border border-white/60 px-2 py-0.5">
                SPACE
              </kbd>{" "}
              to start and shoot.
            </p>
            <p className="text-lg">
              Use <span className="rounded border border-white/60 px-1">←</span>{" "}
              and <span className="rounded border border-white/60 px-1">→</span>{" "}
              to move.
            </p>
          </div>
          <div className="mt-2 flex items-center gap-4">
            <Button
              href="#"
              label="START"
              variant="solid"
              size="small"
              onClick={(e) => {
                e.preventDefault();
                handleStartOrRestart();
              }}
            />
            <Button href="/" label="GO HOME" variant="outline" size="small" />
          </div>
        </section>
      )}

      <div className="relative">
        {/* Score at top-right inside the canvas area */}
        <div
          className="pointer-events-none absolute right-2 top-2 z-10 select-none text-xs text-white/80"
          aria-live="polite"
        >
          Score: {score}
        </div>

        {/* DOM-based overlay grid for pre-start styling (top) */}
        {!hasStarted && (
          <div className="absolute left-1/2 top-[60px] z-10 -translate-x-1/2">
            <div
              style={{
                width: `${gridPixelWidth}px`,
                height: `${gridPixelHeight}px`,
                display: "grid",
                gridTemplateColumns: `repeat(${GRID_COLS}, ${GRID_CELL_SIZE}px)`,
                gridTemplateRows: `repeat(${GRID_ROWS}, ${GRID_CELL_SIZE}px)`,
                gap: `${GRID_GAP}px`,
              }}
              aria-hidden="true"
            >
              {Array.from({ length: GRID_ROWS }).map((_, r) =>
                Array.from({ length: GRID_COLS }).map((__, c) => {
                  const isActive = FOUR_ZERO_FOUR_MASK[r]?.[c] ?? false;
                  return (
                    <div
                      key={`${r}-${c}`}
                      className={
                        isActive
                          ? "bg-white/0 rounded-smborder-none"
                          : "opacity-20 rounded-sm border border-white"
                      }
                      aria-hidden="true"
                    />
                  );
                })
              )}
            </div>
            {/* Instructions placed directly below the grid */}
            <section className="mt-6 flex w-full flex-col items-center gap-6 text-center">
              <h1 className="text-3xl font-semibold tracking-tight">
                Page not found.
              </h1>
              <div className="flex flex-col items-center gap-3 text-white/80">
                <p className="text-lg">
                  Press or hold{" "}
                  <kbd className="rounded border border-white/60 px-2 py-0.5">
                    SPACE
                  </kbd>{" "}
                  to start and shoot.
                </p>
                <p className="text-lg">
                  Use{" "}
                  <span className="rounded border border-white/60 px-1">←</span>{" "}
                  and{" "}
                  <span className="rounded border border-white/60 px-1">→</span>{" "}
                  to move.
                </p>
              </div>
              <div className="mt-2 flex items-center justify-center gap-4">
                <Button
                  href="#"
                  label="START"
                  variant="solid"
                  size="small"
                  onClick={(e) => {
                    e.preventDefault();
                    handleStartOrRestart();
                  }}
                />
                <Button
                  href="/"
                  label="GO HOME"
                  variant="outline"
                  size="small"
                />
              </div>
            </section>
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          role="img"
          aria-label="Space shooter canvas. Press space to start."
          className="block rounded border border-white/20 bg-black"
          tabIndex={0}
          onKeyDown={() => {
            /* focusable for a11y; actual listeners on window */
          }}
        />

        {/* Overlay controls when not started, game over, or victory */}
        {!hasStarted && !isVictory && !isGameOver && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <button
              type="button"
              onClick={handleStartOrRestart}
              className="rounded border border-white/30 px-3 py-1 text-sm text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Start game"
            >
              Start
            </button>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/60">
            <p className="text-base font-medium">Game Over</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleStartOrRestart}
                className="rounded border border-white/30 px-3 py-1 text-sm text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Restart level"
              >
                Restart
              </button>
              <Link
                href="/"
                className="rounded border border-white/30 px-3 py-1 text-sm text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Return to home"
              >
                Return to home
              </Link>
            </div>
          </div>
        )}

        {isVictory && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/60">
            <p className="text-base font-medium">Level cleared!</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleNextLevel}
                className="rounded border border-white/30 px-3 py-1 text-sm text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Next level"
              >
                Next level
              </button>
              <Link
                href="/"
                className="rounded border border-white/30 px-3 py-1 text-sm text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Return to home"
              >
                Return to home
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
