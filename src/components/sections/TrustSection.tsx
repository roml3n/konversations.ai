import React from "react";
import Image from "next/image";
import { Marquee } from "../ui/marquee";
type LogoItem = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
};

type TrustedBySectionProps = {
  logos?: LogoItem[];
};

const DEFAULT_LOGOS: LogoItem[] = [];

const TrustedBySection = ({ logos = DEFAULT_LOGOS }: TrustedBySectionProps) => {
  return (
    <section className="container py-16 md:py-24 bg-white flex flex-col gap-10 md:gap-12 lg:gap-15 overflow-clip">
      <div className="container mx-auto px-4 md:px-16">
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-xl md:text-2xl lg:text-[1.75rem] font-gotham font-medium text-neutral-900 text-center">
            Trusted by industry leaders
          </h2>
          <Marquee>
            {logos.length > 0 ? (
              logos.map((logo, idx) => (
                <div
                  key={`${logo.src}-${idx}`}
                  className="mx-6 flex items-center justify-center"
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt ?? "Partner logo"}
                    width={logo.width ?? 100}
                    height={logo.height ?? 40}
                    className={[
                      "h-5 md:h-7 w-auto object-contain grayscale",
                      logo.className,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  />
                </div>
              ))
            ) : (
              <>
                <span className="text-neutral-500">Add logos to props</span>
              </>
            )}
          </Marquee>
        </div>
      </div>

      {/* Quote */}
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
