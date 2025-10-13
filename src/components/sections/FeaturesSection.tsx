import React from "react";
import FeatureCard from "../FeatureCard";

const FeaturesSection = () => {
  return (
    <section className="w-screen py-16 md:py-24 bg-blue-700">
      <div className="container mx-auto px-4 md:px-16">
        <div className="flex flex-col gap-4 mb-12">
          <h2 className="text-[1.75rem] md:text-4xl lg:text-5xl font-medium font-gotham leading-none tracking-tighter text-white">
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="text-base md:text-lg text-white/60 font-sans tracking-tight leading-[140%]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa
            mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien
            fringilla, mattis ligula consectetur, ultrices .
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <FeatureCard
            title="Conversation insights"
            description="Spot trends in customer sentiment and identify emerging issues instantly."
            className="col-span-1 md:col-span-1 lg:col-span-2"
          />

          <FeatureCard
            title="Team performance"
            description="Compare support metrics across teams, shifts, and regions to see who's thriving and where to improve."
            className="col-span-1 md:col-span-1 lg:col-span-2"
          />

          <FeatureCard
            title="Executive dashboards"
            description="Deliver the right data to leaders—concise, visual, and always up to date."
            className="col-span-1 md:col-span-1 lg:col-span-2"
          />

          <FeatureCard
            title="Workflow transparency"
            description="Track transitions, escalations, and bottlenecks to improve response times."
            className="col-span-1 md:col-span-1 lg:col-span-3"
          />

          <FeatureCard
            title="Customer journeys"
            description="Understand how conversations evolve across channels and touchpoints."
            className="col-span-1 md:col-span-2 lg:col-span-3"
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
