"use client";

import Link from "next/link";
import React from "react";

type ButtonVariant = "solid" | "outline" | "link";
type ButtonSize = "small" | "md" | "lg";

export type ButtonProps = {
  href: string;
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
};

const sizeClasses: Record<ButtonSize, string> = {
  small: "px-3 py-2",
  md: "px-4 py-2.5",
  lg: "px-5 py-3",
};

export default function Button({
  href,
  label,
  variant = "solid",
  size = "small",
  className,
  onClick,
}: ButtonProps) {
  const base =
    "inline-flex justify-center items-center rounded-[46px] outline outline-1 outline-offset-[-1px]";

  const variantClasses: Record<ButtonVariant, string> = {
    solid: "bg-white text-neutral-900 outline-white",
    outline: "outline-white text-white",
    link: "outline-0 text-white underline underline-offset-4",
  };

  const innerTextClass =
    variant === "solid"
      ? "justify-start text-neutral-900 text-base font-medium font-normal uppercase"
      : "justify-start text-white text-base font-medium font-normal uppercase";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={[sizeClasses[size], base, variantClasses[variant], className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={innerTextClass}>{label}</div>
    </Link>
  );
}
