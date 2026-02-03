"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export function Button({
  children,
  onClick,
  type = "button",
  className = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        cursor-pointer
        rounded-md
        px-3
        py-1.5
        text-left
        text-[13px]
        font-normal
        text-white
        no-underline
        outline-none
        border-none
        flex
        w-full
        items-center
        whitespace-nowrap
        bg-gradient-to-b
        from-[#40678c]
        to-[#2c5378]
        transition-all
        duration-[250ms]
        ease-[cubic-bezier(0.05,0.03,0.35,1)]
        hover:from-[#4a7399]
        hover:to-[#366085]
        ${className}
      `}
      style={{
        boxShadow: "inset 0 1px 1px rgba(255,255,255,0)",
        textShadow: "0px 1px 4px rgba(0,0,0,0.25)",
      }}
    >
      {children}
    </button>
  );
}
