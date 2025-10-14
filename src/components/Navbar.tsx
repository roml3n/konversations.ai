"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";

const useScrolled = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    let ticking = false;

    const update = () => {
      setIsScrolled(window.scrollY > 0);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return isScrolled;
};

const Navbar = () => {
  const isScrolled = useScrolled();

  const containerClasses = [
    "container mx-auto z-50 flex items-center justify-between fixed top-0",
    "transition-all duration-300 ease-out",
    isScrolled
      ? "translate-y-3 bg-white/70 backdrop-blur-xl rounded-full pl-4 pr-2 py-2 text-neutral-900 border-[1.4px] border-black/10 w-4/5"
      : "px-16 py-4 text-white",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <nav className={containerClasses} aria-label="Primary" role="navigation">
      <Image src="/logo/color-logo.svg" alt="logo" width={150} height={18} />
      <div className="flex items-center gap-6 font-sans font-medium tracking-tight leading-none">
        <Link
          href="#"
          className={
            isScrolled
              ? "outline-none focus:underline rounded-full px-4 py-2 hover:bg-black/10"
              : "rounded-full px-4 py-2 hover:bg-white/10"
          }
          tabIndex={0}
          aria-label="Product"
        >
          Product
        </Link>
        <Link
          href="#"
          className={
            isScrolled
              ? "outline-none focus:underline rounded-full px-4 py-2 hover:bg-black/10"
              : "rounded-full px-4 py-2 hover:bg-white/10"
          }
          tabIndex={0}
          aria-label="Features"
        >
          Features
        </Link>
      </div>
      <Button
        href="#"
        label="Schedule a demo"
        variant="secondary"
        className={[
          isScrolled
            ? "bg-transparent text-neutral-900 hover:bg-neutral-900/5 !px-3 !py-2 bg-gradient-to-l from-[#01E4AC] to-[#0320F5] outline-none"
            : "!px-3 !py-2 !font-normal",
        ]
          .filter(Boolean)
          .join(" ")}
      />
    </nav>
  );
};

export default Navbar;
