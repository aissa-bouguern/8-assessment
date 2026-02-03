"use client";

import { useState, useRef, useEffect } from "react";

interface KebabMenuProps {
  layout: "list" | "grid";
  onLayoutChange: (layout: "list" | "grid") => void;
}

export function KebabMenu({ layout, onLayoutChange }: KebabMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLayoutSelect = (newLayout: "list" | "grid") => {
    onLayoutChange(newLayout);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-[#1a1a2e] hover:text-white"
        aria-label="Menu"
        aria-expanded={isOpen}
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-lg bg-[#1a1a2e] shadow-lg ring-1 ring-[#2a2a4a]">
          <div className="py-1">
            <button
              type="button"
              onClick={() => handleLayoutSelect("list")}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                layout === "list"
                  ? "bg-[#2a2a4a] text-white"
                  : "text-gray-300 hover:bg-[#2a2a4a] hover:text-white"
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              List View
            </button>
            <button
              type="button"
              onClick={() => handleLayoutSelect("grid")}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                layout === "grid"
                  ? "bg-[#2a2a4a] text-white"
                  : "text-gray-300 hover:bg-[#2a2a4a] hover:text-white"
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              Grid View
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
