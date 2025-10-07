"use client";

import React, { useRef, useState } from "react";
import SpaceShooter404, {
  SpaceShooter404Handle,
} from "@/components/SpaceShooter404";
import Button from "@/components/Button";

export default function NotFound() {
  const gameRef = useRef<SpaceShooter404Handle | null>(null);
  const [gameState, setGameState] = useState<
    "initial" | "playing" | "gameOver"
  >("initial");

  const handleStartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    gameRef.current?.start();
    setGameState("playing");
  };

  const handleRetryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    gameRef.current?.restart();
    setGameState("playing");
  };

  const handleGameOver = () => {
    setGameState("gameOver");
  };

  return (
    <main className="relative h-screen w-full overflow-hidden">
      <SpaceShooter404
        ref={gameRef}
        className="absolute inset-0"
        onGameOver={handleGameOver}
      />

      {gameState !== "playing" && (
        <section className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-6 pb-32 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            {gameState === "gameOver" ? "Game Over" : "Page not found."}
          </h1>

          {gameState === "initial" && (
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
          )}

          <div className="pointer-events-auto mt-2 flex items-center gap-4">
            {gameState === "initial" && (
              <>
                <Button
                  href="#"
                  label="START"
                  variant="solid"
                  size="small"
                  onClick={handleStartClick}
                />
                <Button
                  href="/"
                  label="GO HOME"
                  variant="outline"
                  size="small"
                />
              </>
            )}
            {gameState === "gameOver" && (
              <>
                <Button
                  href="#"
                  label="RETRY"
                  variant="solid"
                  size="small"
                  onClick={handleRetryClick}
                />
                <Button
                  href="/"
                  label="GO HOME"
                  variant="outline"
                  size="small"
                />
              </>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
