"use client";
import React, { useRef } from "react";
import { TextReveal } from "@/components/ui/text-reveal";
import Image from "next/image";

const MissionStatement = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  return (
    <section
      id="product"
      className="flex items-center container bg-white snap-start scroll-mt-24"
    >
      <div
        ref={containerRef}
        className=" h-[120vh] w-full mx-auto gap-5 px-4 md:mx-24 flex items-center justify-center flex-col"
      >
        <div
          id="reveal-container"
          className="sticky top-1/2 -translate-y-1/2 mx-auto flex flex-col items-center justify-center gap-5"
        >
          <div
            className="w-16 md:w-21.5 lg:w-27 aspect-square object-cover   bg-[#030712] rounded-2xl p-3.5 md:p-4.5 lg:p-6"
            aria-hidden="true"
          >
            {" "}
            <Image
              src="/logo/logomark-color.svg"
              height={100}
              width={100}
              alt="konversations logo icon"
            />{" "}
          </div>

          <TextReveal
            progressTargetRef={containerRef}
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
    </section>
  );
};

export default MissionStatement;
