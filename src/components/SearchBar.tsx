"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchBarProps {
  onSearch: (term: string) => void;
  isLoading?: boolean;
  initialValue?: string;
}

export function SearchBar({
  onSearch,
  isLoading = false,
  initialValue = "",
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(initialValue);
  const skipDebouncedSearch = useRef(false);

  // Sync input with external initialValue changes (e.g., URL changes)
  useEffect(() => {
    setInputValue(initialValue);
    // Skip debounced search when syncing from URL to prevent loop
    skipDebouncedSearch.current = true;
  }, [initialValue]);

  const debouncedValue = useDebounce(inputValue, 400);

  // Handle debounced search
  useEffect(() => {
    if (skipDebouncedSearch.current) {
      skipDebouncedSearch.current = false;
      return;
    }
    if (
      debouncedValue.trim().length >= 2 &&
      debouncedValue.trim() !== initialValue.trim()
    ) {
      onSearch(debouncedValue.trim());
    }
  }, [debouncedValue, onSearch, initialValue]);

  // Handle input changes and detect RTL
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Clear search when input is empty
    if (value === "") {
      skipDebouncedSearch.current = true;
      onSearch("");
    }
  };

  // Handle manual search (button click or Enter key)
  const handleManualSearch = useCallback(() => {
    const trimmed = inputValue.trim();
    if (trimmed.length > 0) {
      onSearch(trimmed);
    }
  }, [inputValue, onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleManualSearch();
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search..."
        className="block w-full rounded-lg border border-white/25 bg-[hsla(238,27%,12%,0.5)] py-[5px] px-3 text-center text-sm text-[hsl(242,3%,55%)] outline-none backdrop-blur-[5px] transition-all placeholder:text-[hsl(242,3%,55%)] focus:border-[#7B7BF0] focus:text-white focus:font-medium"
        disabled={isLoading}
      />
      {inputValue && (
        <button
          type="button"
          onClick={() => {
            skipDebouncedSearch.current = true;
            setInputValue("");
            onSearch("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          aria-label="Clear search"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
