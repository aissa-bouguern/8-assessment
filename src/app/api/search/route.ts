import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
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

    if (normalizedResults.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        count: 0,
        term: searchTerm,
        cached: false,
      });
    }

    /**
     * Batch upsert using raw SQL for maximum performance
     * Single query instead of N queries
     */
    const trackIds = normalizedResults.map((item) => item.trackId);

    await prisma.$executeRaw`
      INSERT INTO "MediaItem" (
        "trackId", "trackName", "artistName", "artworkUrl", "collectionName",
        "kind", "trackPrice", "currency", "primaryGenreName", "trackViewUrl",
        "previewUrl", "releaseDate", "searchTerm", "createdAt", "updatedAt"
      )
      SELECT * FROM UNNEST(
        ${normalizedResults.map((i) => i.trackId)}::int[],
        ${normalizedResults.map((i) => i.trackName)}::text[],
        ${normalizedResults.map((i) => i.artistName)}::text[],
        ${normalizedResults.map((i) => i.artworkUrl)}::text[],
        ${normalizedResults.map((i) => i.collectionName)}::text[],
        ${normalizedResults.map((i) => i.kind)}::text[],
        ${normalizedResults.map((i) => i.trackPrice)}::float[],
        ${normalizedResults.map((i) => i.currency)}::text[],
        ${normalizedResults.map((i) => i.primaryGenreName)}::text[],
        ${normalizedResults.map((i) => i.trackViewUrl)}::text[],
        ${normalizedResults.map((i) => i.previewUrl)}::text[],
        ${normalizedResults.map((i) => i.releaseDate)}::timestamp[],
        ${normalizedResults.map((i) => i.searchTerm)}::text[],
        ${normalizedResults.map(() => new Date())}::timestamp[],
        ${normalizedResults.map(() => new Date())}::timestamp[]
      )
      ON CONFLICT ("trackId") DO UPDATE SET
        "trackName" = EXCLUDED."trackName",
        "artistName" = EXCLUDED."artistName",
        "artworkUrl" = EXCLUDED."artworkUrl",
        "collectionName" = EXCLUDED."collectionName",
        "kind" = EXCLUDED."kind",
        "trackPrice" = EXCLUDED."trackPrice",
        "currency" = EXCLUDED."currency",
        "primaryGenreName" = EXCLUDED."primaryGenreName",
        "trackViewUrl" = EXCLUDED."trackViewUrl",
        "previewUrl" = EXCLUDED."previewUrl",
        "releaseDate" = EXCLUDED."releaseDate",
        "searchTerm" = EXCLUDED."searchTerm",
        "updatedAt" = NOW()
    `;

    // Fetch the upserted items
    const storedItems = await prisma.mediaItem.findMany({
      where: { trackId: { in: trackIds } },
    });

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
