"use client";

import { useState, useRef, useEffect } from "react";

export function KebabMenu() {
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

  const handleLayoutSelect = () => {
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
              onClick={handleLayoutSelect}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors text-gray-300 hover:bg-[#2a2a4a] hover:text-white`}
            >
              Settings
            </button>
            <button
              type="button"
              onClick={handleLayoutSelect}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors text-gray-300 hover:bg-[#2a2a4a] hover:text-white`}
            >
              What's New
            </button>
            <button
              type="button"
              onClick={handleLayoutSelect}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors text-gray-300 hover:bg-[#2a2a4a] hover:text-white`}
            >
              About
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
