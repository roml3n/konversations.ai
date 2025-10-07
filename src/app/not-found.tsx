"use client";

import React, { useRef, useState } from "react";
import SpaceShooter404, {
  SpaceShooter404Handle,
} from "@/components/SpaceShooter404";
import Button from "@/components/Button";

export default function NotFound() {
  const gameRef = useRef<SpaceShooter404Handle | null>(null);
  const [gameState, setGameState] = useState<
    "initial" | "playing" | "gameOver" | "victory"
  >("initial");
  const [finalScore, setFinalScore] = useState(0);

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

  const handleGameStart = React.useCallback(() => {
    setGameState("playing");
  }, []);

  const handleGameOver = React.useCallback(() => {
    setGameState("gameOver");
  }, []);

  const handleVictory = React.useCallback((score: number) => {
    setFinalScore(score);
    setGameState("victory");
  }, []);

  return (
    <main
      className="relative h-screen w-full overflow-hidden font-sans"
      style={{ fontFeatureSettings: '"ss02" 1' }}
    >
      <SpaceShooter404
        ref={gameRef}
        className="absolute inset-0 m-8 mb-16 border border-yellow-500"
        onGameStart={handleGameStart}
        onGameOver={handleGameOver}
        onVictory={handleVictory}
      />

      {gameState !== "playing" && (
        <>
          {/* Dimmed background overlay for victory and game over screens */}
          {(gameState === "victory" || gameState === "gameOver") && (
            <div className="absolute inset-0 bg-black/60 z-10" />
          )}

          <section className="pointer-events-none w-full absolute top-[50%] border border-red-500 z-20 flex flex-col items-center gap-6 text-center">
            <div className="w-full">
              {gameState === "gameOver" ? (
                <div className="w-full flex flex-col gap-4">
                  <h1 className="text-3xl font-semibold tracking-tight">
                    Game Over!
                  </h1>
                  <div className="pointer-events-auto flex items-center justify-center gap-4">
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
              ) : gameState === "victory" ? (
                <div className="w-full flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-semibold tracking-tight">
                      Enemy fleet destroyed!
                    </h1>
                    <p className="text-2xl text-white/90 font-mono">
                      Score: {finalScore}
                    </p>
                  </div>
                  <div className="pointer-events-auto flex items-center justify-center gap-4">
                    <Button
                      href="#"
                      label="NEXT LEVEL"
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
                  <div className="pointer-events-auto flex items-center gap-4">
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
        </>
      )}

      {(gameState === "initial" || gameState === "playing") && (
        <div className="absolute bottom-6 w-full pointer-events-auto mt-2 flex flex-col text-white/80 items-center gap-4">
          <p className="text-lg font-normal">
            Press{" "}
            <kbd className="border border-b-2 border-white/40 px-2 py-[1px] bg-white/10 rounded-sm border-offset-[-1px] outline-white/60 inline-flex justify-center items-center gap-2.5 overflow-hidden text-sm">
              SPACE
            </kbd>{" "}
            to shoot. Hold for more power.
          </p>
          <p className="text-lg font-normal">
            Use{" "}
            <span className="border border-b-2 border-white/40 px-2 py-[1px] bg-white/10 rounded-sm border-offset-[-1px] outline-white/60 inline-flex justify-center items-center gap-2.5 overflow-hidden text-sm">
              ←
            </span>{" "}
            and{" "}
            <span className="border border-b-2 border-white/40 px-2 py-[1px] bg-white/10 rounded-sm border-offset-[-1px] outline-white/60 inline-flex justify-center items-center gap-2.5 overflow-hidden text-sm">
              →
            </span>{" "}
            to move.
          </p>
        </div>
      )}
    </main>
  );
}
