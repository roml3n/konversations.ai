import Image from "next/image";
import React from "react";
// import UnicornScene from "unicornstudio-react/next";
import Button from "../Button";

const HeroSection = () => {
  return (
    <section
      className="relative overflow-hidden h-fit w-screen mx-auto"
      style={{
        background:
          "radial-gradient(ellipse 450% 80% at top, #000000 3%, #0227F2 45%, #01E4AC 75%, #ffffff 95%)",
      }}
    >
      {/* <UnicornScene
        projectId="i0mgDCTyoGswEIxJllF8"
        width={1440}
        height={800}
        className="absolute top-0 left-0 inset-0 w-screen h-screen -z-1"
      /> */}
      <div className="container mx-auto px-4 md:px-12 lg:px-48 pt-36 md:pt-36 lg:pt-51 pb-16">
        <div className="w-full mx-auto flex flex-col items-center gap-10 text-center">
          <div className="flex flex-col items-center gap-4">
            <h1 className="font-gotham text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-tight tracking-tighter text-center">
              What if your inbox had a brain?
            </h1>
            <p className="font-sans text-base md:text-lg text-white/60 font-normal">
              Turn every customer interaction into insight. Konversations gives
              your team the clarity to understand performance, sentiment, and
              opportunities across your entire organization.
            </p>
          </div>

          <Button
            href="#"
            label="Schedule a demo"
            variant="primary"
            className="px-3 py-2 -md:px-4 md:py-3 lg:px-7 lg:py-4 -md:text-base md:text-lg lg:text-xl"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-16 ">
        <Image
          className="w-full h-auto] object-cover bg-gradient-to-b from-transparent via-transparent to-white rounded-[1%]"
          src="/images/hero-img.png"
          alt="Dashboard preview"
          width={3840}
          height={1080}
        />
      </div>
    </section>
  );
};

export default HeroSection;
