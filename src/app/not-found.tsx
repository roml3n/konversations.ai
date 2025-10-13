"use client";

import React, { useRef, useState } from "react";
import SpaceShooter404, {
  SpaceShooter404Handle,
  GameEndData,
} from "@/components/SpaceShooter404";
import Button from "@/components/Button";

export default function NotFound() {
  const gameRef = useRef<SpaceShooter404Handle | null>(null);
  const [gameState, setGameState] = useState<
    "initial" | "playing" | "gameOver" | "victory"
  >("initial");
  const [finalScore, setFinalScore] = useState(0);
  const [finalLevel, setFinalLevel] = useState(1);

  const handleStartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    gameRef.current?.start();
    setGameState("playing");
  };

  const handleRetryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    gameRef.current?.restart(true, false); // Reset score when retrying after game over
    setGameState("playing");
  };

  const handleNextLevelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    gameRef.current?.restart(false, true); // Keep score and increment level
    setGameState("playing");
  };

  const handleGameStart = React.useCallback(() => {
    setGameState("playing");
  }, []);

  const handleGameOver = React.useCallback((data: GameEndData) => {
    setFinalScore(data.score);
    setFinalLevel(data.level);
    setGameState("gameOver");
  }, []);

  const handleVictory = React.useCallback((data: GameEndData) => {
    setFinalScore(data.score);
    setFinalLevel(data.level);
    setGameState("victory");
  }, []);

  return (
    <main
      className="relative h-screen  w-full overflow-hidden font-sans"
      style={{
        background:
          "radial-gradient(ellipse 450% 80% at top, #000000 3%, #0227F2 50%)",
      }}
    >
      <SpaceShooter404
        ref={gameRef}
        className="absolute inset-0 mx-8 mt-24 mb-16"
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

          <section className="pointer-events-none w-full absolute top-[50%] z-20 flex flex-col items-center gap-6 text-center">
            <div className="w-full">
              {gameState === "gameOver" ? (
                <div className="w-full flex flex-col gap-4">
                  <div className="inline-flex flex-col justify-start items-center gap-3">
                    <div className="flex flex-col justify-start items-center">
                      <div className="text-center justify-end text-white text-3xl font-semibold font-sans">
                        Game over!
                      </div>
                      <div className="opacity-60 text-center justify-end text-white text-3xl font-sans flex items-center gap-4">
                        <span>Level: {finalLevel}</span>
                        <span>Score: {finalScore}</span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-start items-center gap-2">
                      <div className="inline-flex justify-center items-center gap-1">
                        <div className="opacity-60 text-center justify-start text-white text-lg font-normal font-sans">
                          Your ship got destroyed.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pointer-events-auto flex items-center justify-center gap-4">
                    <Button
                      href="#"
                      label="Retry"
                      variant="primary"
                      onClick={handleRetryClick}
                    />
                    <Button href="/" label="Go Home" variant="secondary" />
                  </div>
                </div>
              ) : gameState === "victory" ? (
                <div className="w-full flex flex-col gap-4">
                  <div className="inline-flex flex-col justify-start items-center gap-3">
                    <div className="flex flex-col justify-start items-center">
                      <div className="text-center justify-end text-white text-3xl font-semibold font-sans">
                        Enemy fleet destroyed!
                      </div>
                      <div className="opacity-60 text-center justify-end text-white text-3xl font-sans flex items-center gap-4">
                        <span>Level: {finalLevel}</span>
                        <span>Score: {finalScore}</span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-start items-center gap-2">
                      <div className="inline-flex justify-center items-center gap-1">
                        <div className="opacity-60 text-center justify-start text-white text-lg font-normal font-sans">
                          Good work obliterating the enemy fleet.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pointer-events-auto flex items-center justify-center gap-4">
                    <Button
                      href="#"
                      label="Next Level"
                      variant="primary"
                      onClick={handleNextLevelClick}
                    />
                    <Button href="/" label="Go Home" variant="secondary" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6">
                  <div className="flex flex-col items-center gap-3">
                    <h1 className="text-3xl font-semibold tracking-tight">
                      Uh-oh! Page not found.
                    </h1>
                    <p className="opacity-60 text-center justify-start text-white text-lg font-normal font-sans">
                      Defeat the enemies to get back home.
                    </p>
                  </div>
                  <div className="pointer-events-auto flex items-center gap-4">
                    <Button
                      href="#"
                      label="Start"
                      variant="primary"
                      onClick={handleStartClick}
                    />
                    <Button href="/" label="Go Home" variant="secondary" />
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
            <kbd className="border border-b-2 border-white/40 px-1 py-[1px] bg-white/10 rounded-sm border-offset-[-1px] outline-white/60 inline-flex justify-center items-center gap-2.5 overflow-hidden text-sm font-medium font-sans text-white">
              SPACE
            </kbd>{" "}
            to shoot. Hold for more power.
          </p>
          <p className="text-lg font-normal">
            Use{" "}
            <span className="border border-b-2 border-white/40 w-5 h-5 bg-white/10 rounded-sm border-offset-[-1px] outline-white/60 inline-flex justify-center items-center gap-2.5 overflow-hidden text-sm">
              <svg
                width="12"
                height="10"
                viewBox="0 0 12 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.7793 4.50879H11.1113V5.5166H2.77832L6.86914 9.63281H5.46875L0.890625 5.0127L5.4834 0.392578H6.88281L2.7793 4.50879Z"
                  fill="white"
                />
              </svg>
            </span>{" "}
            and{" "}
            <span className="border border-b-2 border-white/40 w-5 h-5 bg-white/10 rounded-sm border-offset-[-1px] outline-white/60 inline-flex justify-center items-center gap-2.5 overflow-hidden text-sm">
              <svg
                width="12"
                height="10"
                viewBox="0 0 12 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.1104 5.0127L6.51855 9.63281H5.11816L9.22168 5.5166H0.890625V4.50879H9.22363L5.13281 0.392578H6.53223L11.1104 5.0127Z"
                  fill="white"
                />
              </svg>
            </span>{" "}
            to move.
          </p>
        </div>
      )}
    </main>
  );
}
