import React from "react";

const InteractiveDemoSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-16">
        <div className="max-w-[1312px] mx-auto flex flex-col items-center gap-16">
          <div className="max-w-[814px] flex flex-col items-center gap-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-zinc-800">
              Lorem ipsum dolor sit amet
            </h2>
            <p className="text-base md:text-lg text-zinc-800/60 font-[family-name:var(--font-instrument-sans)]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et
              massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien
              fringilla, mattis ligula consectetur, ultrices .
            </p>
          </div>
          <div className="w-full flex flex-col gap-6">
            <div className="border-b-2 border-neutral-400/20 flex flex-col sm:flex-row items-stretch gap-5">
              <button className="flex-1 p-4 border-b-2 border-blue-700 flex items-center gap-2.5 hover:bg-blue-50 transition-colors">
                <div
                  className="w-16 h-16 bg-neutral-400 rounded-2xl flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="text-lg md:text-xl font-bold text-blue-700">
                  Track
                </span>
              </button>
              <button className="flex-1 p-4 border-b-2 border-transparent flex items-center gap-2.5 hover:bg-zinc-50 transition-colors">
                <div
                  className="w-16 h-16 bg-neutral-400 rounded-2xl flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="text-lg md:text-xl font-bold text-zinc-800">
                  Analyze
                </span>
              </button>
              <button className="flex-1 p-4 border-b-2 border-transparent flex items-center gap-2.5 hover:bg-zinc-50 transition-colors">
                <div
                  className="w-16 h-16 bg-neutral-400 rounded-2xl flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="text-lg md:text-xl font-bold text-zinc-800">
                  Visualize
                </span>
              </button>
              <button className="flex-1 p-4 border-b-2 border-transparent flex items-center gap-2.5 hover:bg-zinc-50 transition-colors">
                <div
                  className="w-16 h-16 bg-neutral-400 rounded-2xl flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="text-lg md:text-xl font-bold text-zinc-800">
                  Act
                </span>
              </button>
            </div>
            <div
              className="w-full aspect-[1312/436] bg-neutral-300 rounded-3xl"
              role="img"
              aria-label="Feature demonstration"
            />
            <p className="text-xl md:text-3xl font-bold text-zinc-700 text-center max-w-[1094px] mx-auto">
              Stay on top of every interaction as it happens. Konversations
              monitors conversations across channels in real time, giving
              managers and teams a clear view of what&apos;s unfolding. No more
              blind spots or lagging reports.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemoSection;
