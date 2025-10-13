import React from "react";

const FooterSection = () => {
  return (
    <footer className="py-16 bg-[radial-gradient(ellipse_102.39%_329.84%_at_50.00%_102.39%,_black_9%,_#0227F2_40%,_#01E4AC_67%,_white_88%,_white_100%)]">
      <div className="container mx-auto px-4 md:px-16">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="w-36 h-4 relative overflow-hidden">
            <div className="w-36 h-5 bg-white" />
          </div>
          <nav className="flex flex-col gap-2" aria-label="Footer navigation">
            <a
              href="#"
              className="text-base md:text-lg text-white font-[family-name:var(--font-instrument-sans)] hover:text-white/80 transition-colors"
            >
              Lorem ipsum
            </a>
            <a
              href="#"
              className="text-base md:text-lg text-white font-[family-name:var(--font-instrument-sans)] hover:text-white/80 transition-colors"
            >
              Lorem ipsum
            </a>
            <a
              href="#"
              className="text-base md:text-lg text-white font-[family-name:var(--font-instrument-sans)] hover:text-white/80 transition-colors"
            >
              Lorem ipsum
            </a>
            <a
              href="#"
              className="text-base md:text-lg text-white font-[family-name:var(--font-instrument-sans)] hover:text-white/80 transition-colors"
            >
              Lorem ipsum
            </a>
            <a
              href="#"
              className="text-base md:text-lg text-white font-[family-name:var(--font-instrument-sans)] hover:text-white/80 transition-colors"
            >
              Lorem ipsum
            </a>
            <a
              href="#"
              className="text-base md:text-lg text-white font-[family-name:var(--font-instrument-sans)] hover:text-white/80 transition-colors"
            >
              Lorem ipsum
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
