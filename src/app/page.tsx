"use client";

import { useState, useCallback } from "react";
import { SearchBar } from "@/components/SearchBar";
import { MediaGrid } from "@/components/MediaGrid";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import type { MediaItem, SearchApiResponse } from "@/types/media";

type SearchState = "idle" | "loading" | "success" | "error";

export default function Home() {
  const [state, setState] = useState<SearchState>("idle");
  const [results, setResults] = useState<MediaItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (term: string) => {
    if (!term.trim()) return;

    setSearchTerm(term);
    setState("loading");
    setError(null);

    try {
      const response = await fetch(`/api/search?term=${encodeURIComponent(term)}`);
      const data: SearchApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Search failed");
      }

      setResults(data.data || []);
      setState("success");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      setState("error");
    }
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          iTunes Search
        </h1>
        <p className="mt-2 text-gray-500">
          Discover songs, podcasts, movies, audiobooks and more
        </p>
      </header>

      {/* Search Section */}
      <section className="mb-10 flex justify-center">
        <SearchBar onSearch={handleSearch} isLoading={state === "loading"} />
      </section>

      {/* Results Section */}
      <section aria-live="polite" aria-atomic="true">
        {state === "idle" && <EmptyState type="idle" />}

        {state === "loading" && (
          <LoadingSpinner message={`Searching for "${searchTerm}"...`} />
        )}

        {state === "error" && (
          <EmptyState type="error" message={error || "Something went wrong"} />
        )}

        {state === "success" && results.length === 0 && (
          <EmptyState
            type="empty"
            message={`No results found for "${searchTerm}"`}
          />
        )}

        {state === "success" && results.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                Found{" "}
                <span className="font-semibold text-gray-900">
                  {results.length}
                </span>{" "}
                results for &ldquo;{searchTerm}&rdquo;
              </p>
            </div>
            <MediaGrid items={results} />
          </>
        )}
      </section>
    </main>
  );
}
