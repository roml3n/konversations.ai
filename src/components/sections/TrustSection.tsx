import React from "react";
import { Marquee } from "../ui/marquee";

const TrustedBySection = () => {
  return (
    <section className="py-16 md:py-24 bg-white flex flex-col gap-10 md:gap-12 lg:gap-15">
      <div className="container mx-auto px-4 md:px-16">
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-xl md:text-2xl lg:text-[1.75rem] font-gotham font-medium text-neutral-900 text-center">
            Trusted by industry leaders
          </h2>
          <Marquee>
            <span>Next.js</span>
            <span>React</span>
            <span>TypeScript</span>
            <span>Tailwind CSS</span>
          </Marquee>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-16 mt-16">
        <div className="flex flex-col items-center gap-8">
          <blockquote className="text-xl md:text-2xl lg:text-[1.75rem] font-gotham font-medium text-neutral-900 text-center tracking-tighter">
            &ldquo;Consectetur adipiscing elit. Ut et massa mi. Aliquam in
            hendrerit urna. Pellentorem ipsum dolor sit amet, consectetur
            adipiscing elit. Ut et massa mi.&rdquo;
          </blockquote>
          <div className="inline-flex items-center gap-4">
            <div
              className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-neutral-400 rounded-2xl"
              aria-hidden="true"
            />
            <div className="flex flex-col items-start gap-px">
              <div className="text-lg md:text-[1.25rem] lg:text-[1.75rem] font-gotham font-medium leading-none text-neutral-900">
                Lorem ipsum
              </div>
              <div className="text-sm md:text-base font-gotham font-normal text-neutral-900">
                CEO, Acme Labs
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
