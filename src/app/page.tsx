"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { MediaList } from "@/components/MediaList";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import type { MediaItem, SearchApiResponse } from "@/types/media";

type SearchState = "idle" | "loading" | "success" | "error";
type LayoutType = "list" | "grid";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryTerm = searchParams.get("q") || "";
  const lastSearchedTerm = useRef<string>("");

  const [state, setState] = useState<SearchState>(
    queryTerm ? "loading" : "idle",
  );
  const [results, setResults] = useState<MediaItem[]>([]);
  const [searchTerm, setSearchTerm] = useState(queryTerm);
  const [error, setError] = useState<string | null>(null);
  const [layout, setLayout] = useState<LayoutType>("list");

  // Perform search when URL query changes
  useEffect(() => {
    // Clear everything when search is reset
    if (!queryTerm) {
      lastSearchedTerm.current = "";
      setResults([]);
      setState("idle");
      return;
    }

    if (queryTerm === lastSearchedTerm.current) return;

    lastSearchedTerm.current = queryTerm;
    setSearchTerm(queryTerm);
    setState("loading");
    setError(null);

    const controller = new AbortController();

    fetch(`/api/search?term=${encodeURIComponent(queryTerm)}`, {
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((data: SearchApiResponse) => {
        if (!data.success) {
          throw new Error(data.error || "Search failed");
        }
        setResults(data.data || []);
        setState("success");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        setState("error");
      });

    return () => controller.abort();
  }, [queryTerm]);

  // Sync URL with search term
  const handleSearch = useCallback(
    (term: string) => {
      if (term.trim() === queryTerm) return;
      if (!term.trim()) {
        router.push("/");
        return;
      }
      router.push(`?q=${encodeURIComponent(term.trim())}`);
    },
    [queryTerm, router],
  );

  // Separate podcasts and episodes for display
  const podcasts = results.filter((item) => item.kind === "podcast");
  const episodes = results.filter((item) => item.kind !== "podcast");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-56 flex-1">
        {/* Header */}
        <Header
          onSearch={handleSearch}
          isLoading={state === "loading"}
          layout={layout}
          onLayoutChange={setLayout}
          searchTerm={queryTerm}
        />

        {/* Content Area */}
        <main className="px-6 py-6">
          <section aria-live="polite" aria-atomic="true">
            {state === "idle" && <EmptyState type="idle" />}

            {state === "loading" && (
              <LoadingSpinner message={`Searching for "${searchTerm}"...`} />
            )}

            {state === "error" && (
              <EmptyState
                type="error"
                message={error || "Something went wrong"}
              />
            )}

            {state === "success" && results.length === 0 && (
              <EmptyState
                type="empty"
                message={`No results found for "${searchTerm}"`}
              />
            )}

            {state === "success" && results.length > 0 && (
              <div className="space-y-10">
                {/* Top Podcasts Section */}
                {podcasts.length > 0 && (
                  <MediaList
                    title={`Top podcasts for ${searchTerm}`}
                    items={podcasts}
                    layout={layout}
                    variant="featured"
                  />
                )}

                {/* Top Episodes Section */}
                {episodes.length > 0 && (
                  <MediaList
                    title={`Top episodes for ${searchTerm}`}
                    items={episodes}
                    layout={layout}
                    variant="compact"
                  />
                )}

                {/* If no podcasts, show all as episodes */}
                {podcasts.length === 0 && episodes.length === 0 && (
                  <MediaList
                    title={`Results for ${searchTerm}`}
                    items={results}
                    layout={layout}
                    variant="featured"
                  />
                )}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
