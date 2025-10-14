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
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleToggleMenu = (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLButtonElement>
  ) => {
    if (event.type === "keydown") {
      const key = (event as React.KeyboardEvent<HTMLButtonElement>).key;
      if (key !== "Enter" && key !== " ") return;
      (event as React.KeyboardEvent<HTMLButtonElement>).preventDefault();
    }
    setIsMenuOpen((prev) => !prev);
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    if (isMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const containerClasses = [
    "z-50 flex items-center justify-between fixed top-0 left-0 right-0",
    "transition-all duration-300 ease-out",
    isScrolled
      ? "translate-y-3 bg-white/70 backdrop-blur-xl rounded-full px-2 pl-4 pr-3 py-2 text-neutral-900 border-[1.4px] border-black/10 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-4/5"
      : "px-4 md:px-16 py-3 md:py-4 text-white",
  ]
    .filter(Boolean)
    .join(" ");

  const linkClasses = isScrolled
    ? "outline-none focus:underline rounded-full px-4 py-2 hover:bg-black/10"
    : "rounded-full px-4 py-2 hover:bg-white/10";

  const iconColor = isScrolled ? "text-neutral-900" : "text-white";
  const getStaggerClasses = (index: number) => {
    const openDelays = ["delay-100", "delay-200", "delay-300", "delay-400"];
    const closeDelays = ["delay-400", "delay-300", "delay-200", "delay-100"];
    const delayClass =
      (isMenuOpen ? openDelays : closeDelays)[index] ||
      (isMenuOpen ? "delay-300" : "delay-100");
    return [
      "transition-all duration-300 ease-out will-change-transform",
      isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0",
      delayClass,
    ]
      .filter(Boolean)
      .join(" ");
  };

  return (
    <>
      <nav className={containerClasses} aria-label="Primary" role="navigation">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/logo/color-logo.svg"
            alt="logo"
            width={120}
            height={14}
            className="md:hidden pl-3"
          />
          <Image
            src="/logo/color-logo.svg"
            alt="logo"
            width={150}
            height={18}
            className="hidden md:block"
          />
        </div>

        {/* Center links */}
        <div className="hidden md:flex items-center gap-6 font-sans font-medium tracking-tight leading-none">
          <Link
            href="#"
            className={linkClasses}
            tabIndex={0}
            aria-label="Product"
          >
            Product
          </Link>
          <Link
            href="#"
            className={linkClasses}
            tabIndex={0}
            aria-label="Features"
          >
            Features
          </Link>
        </div>

        {/* Right side: CTA on desktop, hamburger on mobile */}
        <div className="flex items-center">
          <div className="hidden md:block">
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
          </div>

          {/* Two-line hamburger icon button */}
          <button
            type="button"
            className={[
              "md:hidden inline-flex items-center justify-center rounded-md",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black/50",
              "p-2",
              iconColor,
            ]
              .filter(Boolean)
              .join(" ")}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu-panel"
            onClick={handleToggleMenu}
            onKeyDown={handleToggleMenu}
          >
            {/* Custom two-line icon ("equals" style) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="28"
              height="28"
              className="block"
              aria-hidden="true"
            >
              <rect
                x="3"
                y="7"
                width="18"
                height="2"
                rx="1"
                className="fill-current"
              />
              <rect
                x="3"
                y="15"
                width="18"
                height="2"
                rx="1"
                className="fill-current"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Slide-in full-screen mobile menu (outside nav) */}
      <div
        id="mobile-menu-panel"
        role="dialog"
        aria-modal="true"
        className={[
          "fixed inset-0 z-[60] md:hidden",
          "bg-black/85 backdrop-blur-xl text-white",
          "transform transition-transform duration-300 ease-out",
          isMenuOpen
            ? "translate-x-0 opacity-100 pointer-events-auto"
            : "translate-x-full opacity-0 pointer-events-none",
          "px-4", // 16px horizontal padding
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="flex flex-col justify-between h-full">
          {/* Top: logo and close */}
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="pl-3">
              <Image
                src="/logo/color-logo.svg"
                alt="logo"
                width={130}
                height={16}
              />
            </Link>
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-black/50"
              aria-label="Close menu"
              onClick={() => setIsMenuOpen(false)}
            >
              {/* Close icon (two diagonal lines) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                aria-hidden="true"
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-8">
            {/* Links */}
            <div className="flex-1 flex flex-col gap-2 pt-4 mb-[108px]">
              <Link
                href="#"
                className={[
                  "w-full rounded-lg px-3 py-3 hover:bg-black/5 focus:bg-black/5 outline-none text-2xl font-gotham tracking-tight leading-none font-normal",
                  getStaggerClasses(0),
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setIsMenuOpen(false)}
              >
                Product
              </Link>
              <Link
                href="#"
                className={[
                  "w-full rounded-lg px-3 py-3 hover:bg-black/5 focus:bg-black/5 outline-none text-2xl font-gotham tracking-tight leading-none font-normal",
                  getStaggerClasses(1),
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
            </div>

            {/* Bottom CTA */}
            <div className="pb-6">
              <Button
                href="#"
                label="Schedule a demo"
                variant="primary"
                className={[
                  "w-full !py-3 !justify-center !text-center",
                  getStaggerClasses(2),
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
