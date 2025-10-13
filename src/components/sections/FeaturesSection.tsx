import React from "react";

const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-blue-700">
      <div className="container mx-auto px-4 md:px-16">
        <div className="flex flex-col gap-4 mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="text-base md:text-lg text-white/60 font-[family-name:var(--font-instrument-sans)]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa
            mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien
            fringilla, mattis ligula consectetur, ultrices .
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-6 bg-white rounded-3xl flex flex-col gap-6">
            <div
              className="w-28 h-24 bg-neutral-400 rounded-2xl"
              aria-hidden="true"
            />
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl md:text-3xl font-bold text-zinc-800">
                Conversation insights
              </h3>
              <p className="text-base md:text-lg text-zinc-800/60 font-[family-name:var(--font-instrument-sans)]">
                Spot trends in customer sentiment and identify emerging issues
                instantly.
              </p>
            </div>
          </div>
          <div className="p-6 bg-white rounded-3xl flex flex-col gap-6">
            <div
              className="w-28 h-24 bg-neutral-400 rounded-2xl"
              aria-hidden="true"
            />
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl md:text-3xl font-bold text-zinc-800">
                Team performance
              </h3>
              <p className="text-base md:text-lg text-zinc-800/60 font-[family-name:var(--font-instrument-sans)]">
                Compare support metrics across teams, shifts, and regions to see
                who&apos;s thriving and where to improve.
              </p>
            </div>
          </div>
          <div className="p-6 bg-white rounded-3xl flex flex-col gap-6">
            <div
              className="w-28 h-24 bg-neutral-400 rounded-2xl"
              aria-hidden="true"
            />
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl md:text-3xl font-bold text-zinc-800">
                Executive dashboards
              </h3>
              <p className="text-base md:text-lg text-zinc-800/60 font-[family-name:var(--font-instrument-sans)]">
                Deliver the right data to leaders—concise, visual, and always up
                to date.
              </p>
            </div>
          </div>
          <div className="md:col-span-2 p-6 bg-white rounded-3xl flex flex-col gap-6">
            <div
              className="w-28 h-24 bg-neutral-400 rounded-2xl"
              aria-hidden="true"
            />
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl md:text-3xl font-bold text-zinc-800">
                Workflow transparency
              </h3>
              <p className="text-base md:text-lg text-zinc-800/60 font-[family-name:var(--font-instrument-sans)]">
                Track transitions, escalations, and bottlenecks to improve
                response times.
              </p>
            </div>
          </div>
          <div className="md:col-span-2 lg:col-span-1 p-6 bg-white rounded-3xl flex flex-col gap-6">
            <div
              className="w-28 h-24 bg-neutral-400 rounded-2xl"
              aria-hidden="true"
            />
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl md:text-3xl font-bold text-zinc-800">
                Customer journeys
              </h3>
              <p className="text-base md:text-lg text-zinc-800/60 font-[family-name:var(--font-instrument-sans)]">
                Understand how conversations evolve across channels and
                touchpoints.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
