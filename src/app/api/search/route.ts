import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { searchItunes, normalizeITunesResult } from "@/lib/itunes";
import type { SearchApiResponse, MediaItem } from "@/types/media";

const CACHE_TTL_MS = 60 * 1000; // 1 minute

type CacheEntry = {
  data: MediaItem[];
  timestamp: number;
};

const cache = new Map<string, CacheEntry>();

function getCachedResults(term: string): MediaItem[] | null {
  const entry = cache.get(term.toLowerCase());
  if (!entry) return null;

  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(term.toLowerCase());
    return null;
  }

  return entry.data;
}

function setCachedResults(term: string, data: MediaItem[]): void {
  cache.set(term.toLowerCase(), { data, timestamp: Date.now() });
}

export async function GET(
  request: NextRequest,
): Promise<NextResponse<SearchApiResponse>> {
  const searchParams = request.nextUrl.searchParams;
  const term = searchParams.get("term");

  /**
   * Validate term parameter
   */
  if (!term || term.trim() === "") {
    return NextResponse.json(
      { success: false, error: "Search term is required" },
      { status: 400 },
    );
  }

  const searchTerm = term.trim();

  try {
    // Check cache first
    const cachedResults = getCachedResults(searchTerm);
    if (cachedResults) {
      return NextResponse.json({
        success: true,
        data: cachedResults,
        count: cachedResults.length,
        term: searchTerm,
        cached: true,
      });
    }

    /**
     * Fetch from iTunes API
     */
    const iTunesResults = await searchItunes(searchTerm);

    /**
     * Normalize results and filter out invalid ones
     */
    const normalizedResults = iTunesResults
      .map((result) => normalizeITunesResult(result, searchTerm))
      .filter((item): item is NonNullable<typeof item> => item !== null);

    /**
     * Upsert each item in parallel
     */
    const upsertPromises = normalizedResults.map((item) =>
      prisma.mediaItem.upsert({
        where: { trackId: item.trackId },
        update: {
          trackName: item.trackName,
          artistName: item.artistName,
          artworkUrl: item.artworkUrl,
          collectionName: item.collectionName,
          kind: item.kind,
          trackPrice: item.trackPrice,
          currency: item.currency,
          primaryGenreName: item.primaryGenreName,
          trackViewUrl: item.trackViewUrl,
          previewUrl: item.previewUrl,
          releaseDate: item.releaseDate,
          searchTerm: item.searchTerm,
        },
        create: item,
      }),
    );

    const storedItems = await Promise.all(upsertPromises);

    /**
     * Cache the results
     */
    setCachedResults(searchTerm, storedItems);

    return NextResponse.json({
      success: true,
      data: storedItems,
      count: storedItems.length,
      term: searchTerm,
      cached: false,
    });
  } catch (error) {
    console.error("Search API error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
