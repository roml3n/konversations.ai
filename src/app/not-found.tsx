"use client";

import React, { useRef } from "react";
import SpaceShooter404, {
  SpaceShooter404Handle,
} from "@/components/SpaceShooter404";
import Button from "@/components/Button";

export default function NotFound() {
  const gameRef = useRef<SpaceShooter404Handle | null>(null);

  const handleStartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    gameRef.current?.start();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-6 py-10">
      <div className="relative w-full">
        <SpaceShooter404 ref={gameRef} className="relative w-full" />
      </div>

      <section className="flex w-full max-w-5xl flex-col items-center gap-6 text-center">
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
            onClick={handleStartClick}
          />
          <Button href="/" label="GO HOME" variant="outline" size="small" />
        </div>
      </section>
    </main>
  );
}
