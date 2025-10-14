"use client";

import React, { useRef, useState } from "react";
import SpaceShooter404, {
  SpaceShooter404Handle,
  GameEndData,
} from "@/components/SpaceShooter404";
import Button from "@/components/Button";
import Image from "next/image";

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
        className="absolute inset-0 mx-4 md:mx-8 mt-24 mb-28 md:mb-16"
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
                    <h1 className="text-3xl font-semibold tracking-tight text-white">
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

      {gameState === "initial" && (
        <div className="absolute bottom-6 w-full pointer-events-auto mt-2 flex flex-col text-white/80 items-center gap-4">
          <p className="hidden md:block text-lg font-normal">
            Press{" "}
            <kbd className="mx-1 border border-b-2 border-white/40 px-1 py-[1px] bg-white/10 rounded-sm border-offset-[-1px] outline-white/60 inline-flex justify-center items-center gap-2.5 overflow-hidden text-sm font-medium font-sans text-white">
              SPACE
            </kbd>{" "}
            to shoot. Hold for more power.
          </p>
          <p className="hidden md:block text-lg font-normal">
            Use
            <span className="mx-1 border border-b-2 border-white/40 w-5 h-5 bg-white/10 rounded-sm border-offset-[-1px] outline-white/60 inline-flex justify-center items-center overflow-hidden text-sm">
              <Image
                src="/icons/arrow-left.svg"
                alt="right arrow"
                width={12}
                height={10}
              />
            </span>
            and
            <span className="mx-1 border border-b-2 border-white/40 w-5 h-5 bg-white/10 rounded-sm border-offset-[-1px] outline-white/60 inline-flex justify-center items-center overflow-hidden text-sm">
              <Image
                src="/icons/arrow-right.svg"
                alt="right arrow"
                width={12}
                height={10}
              />
            </span>
            to move.
          </p>

          <p className="md:hidden text-lg font-normal">
            Press{" "}
            <span className="mx-1 border border-b-2 border-white/40 w-6 h-6 p-1 bg-white/10 rounded-sm border-offset-[-1px] outline-white/60 inline-flex justify-center items-center overflow-hidden text-sm">
              <Image
                src="/icons/crosshair.svg"
                alt="right arrow"
                width={16}
                height={14}
              />
            </span>
            to shoot. Hold for more power.
          </p>
          <p className="md:hidden text-lg font-normal">
            Use
            <span className="mx-1 border border-b-2 border-white/40 w-5 h-5 bg-white/10 rounded-sm border-offset-[-1px] outline-white/60 inline-flex justify-center items-center overflow-hidden text-sm">
              <Image
                src="/icons/arrow-left.svg"
                alt="right arrow"
                width={12}
                height={10}
              />
            </span>
            and
            <span className="mx-1 border border-b-2 border-white/40 w-5 h-5 bg-white/10 rounded-sm border-offset-[-1px] outline-white/60 inline-flex justify-center items-center overflow-hidden text-sm">
              <Image
                src="/icons/arrow-right.svg"
                alt="right arrow"
                width={12}
                height={10}
              />
            </span>
            to move.
          </p>
        </div>
      )}

      {gameState === "playing" && (
        <div className="md:hidden absolute bottom-4 left-0 right-0 w-full px-4 pointer-events-auto text-white/80">
          <div className="w-full flex justify-center items-end gap-6">
            <button
              type="button"
              aria-label="Move left"
              className="flex-1 h-14 bg-white/20 rounded-2xl outline outline-offset-[-1px] outline-white flex justify-center items-center overflow-hidden active:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/60"
              onPointerDown={(e) => {
                e.preventDefault();
                gameRef.current?.pressLeft();
              }}
              onPointerUp={() => gameRef.current?.releaseLeft()}
              onPointerCancel={() => gameRef.current?.releaseLeft()}
              onPointerLeave={() => gameRef.current?.releaseLeft()}
            >
              <span className="sr-only">Left</span>
              <Image
                src="/icons/arrow-left.svg"
                alt=""
                aria-hidden
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </button>
            <button
              type="button"
              aria-label="Shoot"
              className="!w-20 !h-20 relative bg-white rounded-3xl outline outline-offset-[-1px] outline-white/20 overflow-hidden flex items-center justify-center active:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/60"
              onPointerDown={(e) => {
                e.preventDefault();
                gameRef.current?.pressShoot();
              }}
              onPointerUp={() => gameRef.current?.releaseShoot()}
              onPointerCancel={() => gameRef.current?.releaseShoot()}
              onPointerLeave={() => gameRef.current?.releaseShoot()}
            >
              <span className="sr-only">Shoot</span>
              <span
                aria-hidden
                className="block !w-10 !h-10"
                style={{
                  backgroundColor: "#0227F2",
                  WebkitMask:
                    "url(/icons/crosshair.svg) no-repeat center / contain",
                  mask: "url(/icons/crosshair.svg) no-repeat center / contain",
                }}
              />
            </button>
            <button
              type="button"
              aria-label="Move right"
              className="flex-1 h-14 bg-white/20 rounded-2xl outline outline-offset-[-1px] outline-white flex justify-center items-center overflow-hidden active:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/60"
              onPointerDown={(e) => {
                e.preventDefault();
                gameRef.current?.pressRight();
              }}
              onPointerUp={() => gameRef.current?.releaseRight()}
              onPointerCancel={() => gameRef.current?.releaseRight()}
              onPointerLeave={() => gameRef.current?.releaseRight()}
            >
              <span className="sr-only">Right</span>
              <Image
                src="/icons/arrow-right.svg"
                alt=""
                aria-hidden
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
