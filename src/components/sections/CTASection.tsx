import React from "react";
import Button from "../Button";

const CTASection = () => {
  return (
    <section className="py-16 bg-[radial-gradient(ellipse_102.39%_329.84%_at_50.00%_102.39%,_black_9%,_#0227F2_40%,_#01E4AC_67%,_white_88%,_white_100%)]">
      <div className="container mx-auto px-4 md:px-16">
        <div className="max-w-[980px] mx-auto flex flex-col items-center gap-10">
          <div className="flex flex-col items-start gap-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-zinc-800 w-full">
              Build Connections. Build Growth.
            </h2>
            <p className="text-base md:text-lg text-zinc-800/60 font-[family-name:var(--font-instrument-sans)] w-full">
              Every interaction is an opportunity with Konversations. Turn
              support into strategy and insights into impact.
            </p>
          </div>
          <Button
            href="#"
            label="Schedule a demo"
            variant="primary"
            className="px-7 py-4"
          />
        </div>
      </div>
    </section>
  );
};

export default CTASection;
