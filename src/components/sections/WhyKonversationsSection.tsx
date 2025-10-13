import React from "react";

const WhyKonversationsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-16">
        <div className="max-w-[1151px] mx-auto p-6 md:p-9 bg-zinc-100 rounded-3xl border border-black/10 flex flex-col lg:flex-row gap-9 overflow-hidden">
          <div className="flex-1 flex flex-col justify-between gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl md:text-5xl font-bold text-zinc-800">
                Why Konversations?
              </h2>
              <p className="text-base md:text-lg text-zinc-800/60 font-[family-name:var(--font-instrument-sans)]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et
                massa mi. Aliquam in hendrerit urna. Pellentesque sit amet
                sapien fringilla, mattis ligula consectetur, ultrices .
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-2.5">
                <div
                  className="w-11 h-10 bg-neutral-400 rounded-lg flex-shrink-0"
                  aria-hidden="true"
                />
                <div className="flex-1 flex flex-col gap-2">
                  <h3 className="text-lg font-bold text-zinc-800">
                    See the bigger picture
                  </h3>
                  <p className="text-base text-zinc-800/60 font-[family-name:var(--font-instrument-sans)]">
                    Track performance across teams with one unified view.
                  </p>
                </div>
              </div>
              <div className="h-px relative bg-zinc-300">
                <div className="w-80 h-px bg-blue-700 absolute top-0 left-0" />
              </div>
              <div className="flex items-center gap-2.5 opacity-40">
                <div
                  className="w-11 h-10 bg-neutral-400 rounded-lg flex-shrink-0"
                  aria-hidden="true"
                />
                <div className="flex-1 flex flex-col gap-2">
                  <h3 className="text-lg font-bold text-zinc-800">
                    Understand your customers
                  </h3>
                </div>
              </div>
              <div className="h-px bg-zinc-300" />
              <div className="flex items-center gap-2.5 opacity-40">
                <div
                  className="w-11 h-10 bg-neutral-400 rounded-lg flex-shrink-0"
                  aria-hidden="true"
                />
                <div className="flex-1 flex flex-col gap-2">
                  <h3 className="text-lg font-bold text-zinc-800">
                    Grow with confidence
                  </h3>
                </div>
              </div>
              <div className="h-px bg-zinc-300" />
            </div>
          </div>
          <div className="w-full lg:w-[648px] h-[400px] lg:h-[738px] relative">
            <div
              className="w-full h-full bg-neutral-300 rounded-tl-2xl"
              role="img"
              aria-label="Platform visualization"
            />
            <div className="absolute bottom-16 left-6 flex items-center gap-3">
              <div
                className="w-16 h-16 bg-neutral-400 rounded-full"
                aria-hidden="true"
              />
              <div
                className="w-7 h-6 bg-neutral-400 rounded-sm rotate-90"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyKonversationsSection;
