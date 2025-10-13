import React from "react";
import Button from "../Button";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <section
      className="py-16 w-screen"
      style={{
        background:
          "radial-gradient(ellipse 450% 80% at bottom, #000000 3%, #0227F2 45%, #01E4AC 75%, #ffffff 110%)",
      }}
    >
      <div className="container mx-auto px-4 md:px-16 flex flex-col gap-16">
        <div className="w-full mx-auto flex flex-col items-center gap-10">
          <div className="flex flex-col items-start gap-4 text-center">
            <h2 className="font-medium font-gotham leading-none tracking-tighter text-[1.75rem] md:text-4xl lg:text-5xl  text-zinc-800 w-full">
              Build Connections. Build Growth.
            </h2>
            <p className="text-base md:text-lg text-zinc-800/60 font-sans w-full">
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

        {/* Links */}
        <div className="w-full mx-auto items-center flex flex-col md:flex-row gap-5 md:justify-between">
          <Image
            src="/logo/white-logo.svg"
            alt="logo"
            width={150}
            height={18}
          />

          <Link
            href="https://pawait.africa"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit website"
            className="decoration-none hover:underline hover:decoration-blue hover:underline-offset-4 font-normal font-sans text-base md:text-lg text-white"
          >
            ©2025 A Product of PawaIT Solutions Ltd.
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Footer;
