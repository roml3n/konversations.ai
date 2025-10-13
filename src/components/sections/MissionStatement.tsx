"use client";
import React, { useRef } from "react";
import { TextReveal } from "@/components/ui/text-reveal";

const MissionStatement = () => {
  const scrollTrackRef = useRef<HTMLDivElement | null>(null);
  return (
    <section className="bg-white snap-start">
      <div className="container min-h-screen mx-auto gap-5 px-4 md:px-16 flex items-center justify-center flex-col">
        <div
          id="reveal-container"
          className="sticky top-1/2 -translate-y-1/2 mx-auto flex flex-col items-center justify-center gap-5"
        >
          <div
            className="w-16 h-16 md:w-21.5 md:h-21.5 lg:w-27 lg:h-27 bg-neutral-400 rounded-2xl"
            aria-hidden="true"
          />

          <TextReveal
            progressTargetRef={scrollTrackRef}
            className="text-zinc-400 text-xl md:text-[1.5rem] lg:text-[1.75rem] font-medium text-center font-gotham tracking-tighter leading-none"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa
            mi. Aliquam in hendrerit urna. Pellentorem ipsum dolor sit amet,
            consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit
            urna. Pellentesque uam in hendrerit urna. Pellentorem ipsum dolor
            sit.
          </TextReveal>
        </div>
      </div>
      <div ref={scrollTrackRef} className="h-[200vh]" aria-hidden="true" />
    </section>
  );
};

export default MissionStatement;
