"use client";

import Link from "next/link";
import React from "react";

type ButtonVariant = "primary" | "secondary";

export type ButtonProps = {
  href: string;
  label: string;
  variant?: ButtonVariant;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
};

export default function Button({
  href,
  label,
  variant = "primary",
  className,
  onClick,
}: ButtonProps) {
  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      "bg-white inline-flex justify-center items-center outline outline-1 outline-offset-[-1px] rounded-full text-base font-semibold text-[#0227F2] outline-white px-3 py-2",
    secondary:
      "outline-whiteinline-flex justify-center items-center outline outline-1 outline-offset-[-1px] rounded-full text-base font-semibold  text-white outline-offset-[-1px] px-3 py-2",
  };

  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        variantClasses[variant],
        "justify-start text-base font-medium",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label}
    </Link>
  );
}
