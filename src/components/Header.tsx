"use client";

import { useRouter } from "next/navigation";
import { SearchBar } from "./SearchBar";
import { KebabMenu } from "./KebabMenu";
import { Button } from "./Button";

interface HeaderProps {
  onSearch: (term: string) => void;
  isLoading: boolean;
  layout: "list" | "grid";
  onLayoutChange: (layout: "list" | "grid") => void;
  searchTerm?: string;
}

export function Header({
  onSearch,
  isLoading,
  layout,
  onLayoutChange,
  searchTerm = "",
}: HeaderProps) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 bg-[#151628] px-4 py-3 mb-6">
      {/* Logo + Navigation Arrows */}
      <div className="flex items-center gap-2">
        {/* Logo - only visible on mobile */}
        <div className="md:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <svg
              className="h-5 w-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
        </div>
        <button
          type="button"
          onClick={() => router.back()}
          className="cursor-pointer text-gray-400 transition-colors hover:text-white"
          aria-label="Go back"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => router.forward()}
          className="cursor-pointer text-gray-400 transition-colors hover:text-white"
          aria-label="Go forward"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Search Bar */}
      <div className="grow">
        <SearchBar
          onSearch={onSearch}
          isLoading={isLoading}
          initialValue={searchTerm}
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Hide login/signup buttons on mobile - these are sidebar elements */}
        <div className="hidden md:block w-auto">
          <Button className="whitespace-nowrap rounded-lg px-3 text-sm">
            Log in
          </Button>
        </div>
        <div className="hidden md:block w-auto">
          <Button className="whitespace-nowrap rounded-lg px-3 text-sm">
            Sign up
          </Button>
        </div>
        <KebabMenu />
      </div>
    </header>
  );
}
