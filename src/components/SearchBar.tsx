"use client";

import { useState, useEffect, useCallback } from "react";
import { isRTL } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchBarProps {
  onSearch: (term: string) => void;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [inputValue, setInputValue] = useState("");
  const [textDirection, setTextDirection] = useState<"ltr" | "rtl">("ltr");

  const debouncedValue = useDebounce(inputValue, 400);

  // Handle debounced search
  useEffect(() => {
    if (debouncedValue.trim().length >= 2) {
      onSearch(debouncedValue.trim());
    }
  }, [debouncedValue, onSearch]);

  // Handle input changes and detect RTL
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Detect text direction based on first non-space character
    const firstChar = value.trim().charAt(0);
    setTextDirection(isRTL(firstChar) ? "rtl" : "ltr");
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
    <div className="flex w-full max-w-2xl gap-3">
      <div className="relative flex-1">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search for songs, podcasts, movies..."
          dir={textDirection}
          className="search-input w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-gray-900 shadow-sm transition-all placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          disabled={isLoading}
        />
        {inputValue && (
          <button
            type="button"
            onClick={() => setInputValue("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <button
        type="button"
        onClick={handleManualSearch}
        disabled={isLoading || inputValue.trim().length === 0}
        className="btn-primary rounded-xl bg-blue-500 px-6 py-3 font-medium text-white shadow-sm transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
