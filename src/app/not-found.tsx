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
        className="absolute inset-0 m-8 mb-16 border border-yellow-500"
        onGameOver={handleGameOver}
      />

      {gameState !== "playing" && (
        <>
          <section className="pointer-events-none w-full absolute top-[50%] border border-red-500 z-20 flex flex-col items-center gap-6 text-center">
            <div className="w-full">
              {gameState === "gameOver" ? (
                <div className="w-full flex flex-col gap-4">
                  <h1 className="text-3xl font-semibold tracking-tight">
                    Game Over!
                  </h1>
                  <div className="flex items-center justify-center gap-4">
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
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6">
                  <div className="flex flex-col items-center gap-3">
                    <h1 className="text-3xl font-semibold tracking-tight">
                      Uh-oh! Page not found.
                    </h1>
                    <p className="text-lg text-white/80">
                      Defeat the enemies to get back home.
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
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
                  </div>
                </div>
              )}
            </div>
          </section>

          {gameState === "initial" && (
            <div className="absolute bottom-6 w-full pointer-events-auto mt-2 flex flex-col text-white/80 items-center gap-4">
              <p className="text-lg">
                Press{" "}
                <kbd className="rounded border border-white/60 px-2 py-0.5">
                  SPACE
                </kbd>{" "}
                to shoot. Hold for more power.
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
        </>
      )}
    </main>
  );
}
