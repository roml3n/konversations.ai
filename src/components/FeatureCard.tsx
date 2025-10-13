import Image from "next/image";
import React from "react";

type FeatureCardProps = {
  title: string;
  description: string;
  icon?: string;
  className?: string;
};

const FeatureCard = ({
  title,
  description,
  icon,
  className,
}: FeatureCardProps) => {
  return (
    <div
      className={`flex flex-col gap-4 p-4 md:p-6 bg-white rounded-2xl ${
        className ?? ""
      }`}
    >
      <div className="h-16 w-16 md:w-20 lg:w-24 md:h-20 lg:h-24 bg-gray-200 rounded-md flex gap-6 items-center justify-center overflow-hidden">
        {icon ? (
          <Image
            src={icon}
            width={100}
            height={100}
            alt="Feature icon"
            className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 object-contain"
          />
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-xl md:text-2xl lg:text-[1.5rem] font-medium  tracking-tighter leading-none font-gotham text-zinc-800">
          {title}
        </h3>
        <p className="text-base md:text-lg text-zinc-800/60 font-sans tracking-tight leading-none ">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;
