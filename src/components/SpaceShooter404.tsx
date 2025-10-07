"use client";

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import enemyShipPositions from "@/app/not-found/enemy-ship-positions.json";

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

export type SpaceShooter404Handle = { start: () => void; restart: () => void };

const CANVAS_HEIGHT = 560;
const GRID_COLS = (enemyShipPositions as { columns: number }).columns - 2; // A..V
const GRID_ROWS = (enemyShipPositions as { rows: number }).rows;
const GRID_CELL_SIZE = 24;
const GRID_GAP = 4;
const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 20;
const PLAYER_BOTTOM_MARGIN = 64;
const PLAYER_COLOR = "#ffffff";
const ENEMY_COLOR = "#ffffff";
const LASER_COLOR = "#ffffff";
const ENEMY_BULLET_SPEED = 2.0;
const PLAYER_BULLET_SPEED = -7.2;
const COLLISION_PADDING = 2;

const randomId = () => Math.random().toString(36).slice(2);
const clamp = (v: number, min: number, max: number) =>
  v < min ? min : v > max ? max : v;
const rectOverlap = (
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number }
) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

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

const FOUR_ZERO_FOUR_MASK: boolean[][] = (() => {
  const rows = GRID_ROWS;
  const cols = GRID_COLS;
  const mask: boolean[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => false)
  );
  const colLetterToIndex = (letter: string) =>
    letter.toUpperCase().charCodeAt(0) - 65;
  const { active_ships } = enemyShipPositions as { active_ships: string[][] };
  for (const group of active_ships) {
    for (const coord of group) {
      const col = colLetterToIndex(coord[0]);
      const row = Number(coord.slice(1)) - 1;
      if (row >= 0 && row < rows && col >= 0 && col < cols)
        mask[row][col] = true;
    }
  }
  return mask;
})();

const SpaceShooter404 = forwardRef<
  SpaceShooter404Handle,
  { className?: string }
>(function SpaceShooter404({ className }, ref) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const [hasStarted, setHasStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [score, setScore] = useState(0);
  const [canvasWidth, setCanvasWidth] = useState(800);

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
  const enemiesRef = useRef<Enemy[]>([]);
  const enemyBulletsRef = useRef<Bullet[]>([]);
  const explosionsRef = useRef<Explosion[]>([]);

  const lastFrameTimeRef = useRef<number>(0);
  const playerShootCooldownRef = useRef<number>(0);

  const gridPixelWidth =
    GRID_COLS * GRID_CELL_SIZE + (GRID_COLS - 1) * GRID_GAP;
  const gridOffsetX = (canvasWidth - gridPixelWidth) / 2;
  const gridOffsetY = 60;

  const isChargingRef = useRef(false);
  const chargeStartTsRef = useRef(0);
  const chargeProgressRef = useRef(0);

  const initializePlayer = useCallback(() => {
    playerRef.current = {
      position: {
        x: canvasWidth / 2 - PLAYER_WIDTH / 2,
        y: CANVAS_HEIGHT - PLAYER_BOTTOM_MARGIN - PLAYER_HEIGHT,
      },
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
    };
    playerBulletsRef.current = [];
    playerShootCooldownRef.current = 0;
  }, [canvasWidth]);

  const buildEnemiesFromMask = useCallback(() => {
    const enemies: Enemy[] = [];
    const speedScale = 1;
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        if (!FOUR_ZERO_FOUR_MASK[row]?.[col]) continue;
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
          shootCooldownMs: 1500 + Math.random() * 1500,
          color: ENEMY_COLOR,
        });
      }
    }
    enemiesRef.current = enemies;
    enemyBulletsRef.current = [];
    explosionsRef.current = [];
  }, [gridOffsetX, gridOffsetY]);

  const resetGame = useCallback(() => {
    setIsGameOver(false);
    setIsVictory(false);
    initializePlayer();
    buildEnemiesFromMask();
  }, [buildEnemiesFromMask, initializePlayer]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

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
    playerShootCooldownRef.current = 160;
  }, []);

  const shootBurst = useCallback((count: number) => {
    const player = playerRef.current;
    if (!player) return;
    const centerX = player.position.x + PLAYER_WIDTH / 2 - 1;
    const centerY = player.position.y - 8;
    const startDeg = -90 - 30;
    const endDeg = -90 + 30;
    const n = Math.max(1, Math.min(10, count));
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0.5 : i / (n - 1);
      const deg = startDeg + (endDeg - startDeg) * t;
      const rad = (deg * Math.PI) / 180;
      const speed = 8;
      const vx = Math.cos(rad) * speed;
      const vy = Math.sin(rad) * speed;
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

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setCanvasWidth(containerRef.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
        if (isChargingRef.current) {
          const heldMs = performance.now() - chargeStartTsRef.current;
          const clamped = Math.min(3000, Math.max(0, heldMs));
          const TAP_THRESHOLD_MS = 150;
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
  }, [hasStarted, isGameOver, shootPlayerBullet, shootBurst]);

  const enemiesShoot = useCallback((dtMs: number) => {
    const MAX_ENEMY_BULLETS_ON_SCREEN = 6;
    const MAX_ENEMY_SHOOTERS_PER_TICK = 2;
    if (enemyBulletsRef.current.length >= MAX_ENEMY_BULLETS_ON_SCREEN) return;
    const aliveEnemies = enemiesRef.current.filter((e) => e.alive);
    const shuffled = [...aliveEnemies].sort(() => Math.random() - 0.5);
    let shootersRemaining = MAX_ENEMY_SHOOTERS_PER_TICK;
    for (const enemy of shuffled) {
      if (shootersRemaining <= 0) break;
      enemy.shootCooldownMs -= dtMs;
      if (enemy.shootCooldownMs <= 0) {
        enemy.shootCooldownMs = 1500 + Math.random() * 1500;
        if (enemyBulletsRef.current.length >= MAX_ENEMY_BULLETS_ON_SCREEN)
          break;
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

      if (inputRef.current.left) player.position.x -= 4.5;
      if (inputRef.current.right) player.position.x += 4.5;
      player.position.x = clamp(
        player.position.x,
        8,
        canvasWidth - PLAYER_WIDTH - 8
      );

      playerShootCooldownRef.current = Math.max(
        0,
        playerShootCooldownRef.current - dtMs
      );
      if (inputRef.current.shootHeld) {
        const elapsed = performance.now() - chargeStartTsRef.current;
        const raw = Math.max(0, Math.min(1, elapsed / 3000));
        chargeProgressRef.current = Math.pow(raw, 0.5);
      }

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

      for (const enemy of enemiesRef.current) {
        if (!enemy.alive) continue;
        enemy.velocity.x += (Math.random() - 0.5) * 0.15;
        enemy.velocity.x = clamp(enemy.velocity.x, -2, 2);
        enemy.position.x += enemy.velocity.x;
        if (
          enemy.position.x <= 8 ||
          enemy.position.x + enemy.width >= canvasWidth - 8
        ) {
          enemy.velocity.x *= -1;
          enemy.position.y += 8;
        }
        if (Math.random() < 0.01) enemy.velocity.x *= -1;
        enemy.position.y += enemy.velocity.y * 0.03;
      }

      enemiesShoot(dtMs);

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
          if (rectOverlap(a, r)) {
            e.alive = false;
            setScore((s) => s + 10);
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

      const playerRect = {
        x: player.position.x,
        y: player.position.y,
        w: PLAYER_WIDTH,
        h: PLAYER_HEIGHT,
      };
      for (const b of enemyBulletsRef.current) {
        const r = { x: b.position.x, y: b.position.y, w: b.width, h: b.height };
        if (rectOverlap(playerRect, r)) {
          setIsGameOver(true);
          setHasStarted(false);
          return;
        }
      }
      for (const e of enemiesRef.current) {
        if (!e.alive) continue;
        const r = { x: e.position.x, y: e.position.y, w: e.width, h: e.height };
        if (rectOverlap(playerRect, r)) {
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

      const anyAlive = enemiesRef.current.some((e) => e.alive);
      if (!anyAlive) {
        setIsVictory(true);
        setHasStarted(false);
      }

      explosionsRef.current = explosionsRef.current
        .map((ex) => ({ ...ex, ageMs: ex.ageMs + dtMs }))
        .filter((ex) => ex.ageMs < ex.durationMs);
    },
    [enemiesShoot, canvasWidth]
  );

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, canvasWidth, CANVAS_HEIGHT);

      // Player
      const player = playerRef.current;
      if (player) {
        const strokeWidth = 1;
        const inset = strokeWidth;
        const maxSquish = 8;
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

      // Enemies
      for (const enemy of enemiesRef.current) {
        if (!enemy.alive) continue;
        const strokeWidth = 1;
        const inset = strokeWidth;
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

      // Explosions
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
    [canvasWidth]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const loop = (ts: number) => {
      if (lastFrameTimeRef.current === 0) lastFrameTimeRef.current = ts;
      const dt = ts - lastFrameTimeRef.current;
      lastFrameTimeRef.current = ts;
      if (hasStarted && !isGameOver && !isVictory) update(dt);
      draw(ctx);
      animationRef.current = requestAnimationFrame(loop);
    };
    animationRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [draw, hasStarted, isGameOver, isVictory, update]);

  const handleStart = useCallback(() => {
    if (isGameOver || isVictory) {
      resetGame();
      setHasStarted(true);
      return;
    }
    setHasStarted(true);
  }, [isGameOver, isVictory, resetGame]);

  useImperativeHandle(ref, () => ({ start: handleStart, restart: resetGame }), [
    handleStart,
    resetGame,
  ]);

  return (
    <div ref={containerRef} className={className}>
      {/* Score */}
      <div
        className="pointer-events-none absolute right-2 top-2 z-10 select-none text-xs text-white/80"
        aria-live="polite"
      >
        Score: {score}
      </div>

      {/* Fleet grid overlay at top before game start */}
      {!hasStarted && (
        <div className="absolute left-1/2 top-[60px] z-10 -translate-x-1/2">
          <div
            style={{
              width: `${
                GRID_COLS * GRID_CELL_SIZE + (GRID_COLS - 1) * GRID_GAP
              }px`,
              height: `${
                GRID_ROWS * GRID_CELL_SIZE + (GRID_ROWS - 1) * GRID_GAP
              }px`,
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
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={CANVAS_HEIGHT}
        role="img"
        aria-label="Space shooter canvas"
        className="block w-full"
        style={{ height: `${CANVAS_HEIGHT}px` }}
      />
    </div>
  );
});

export default SpaceShooter404;
