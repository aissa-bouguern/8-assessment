import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { searchItunes, normalizeITunesResult } from "@/lib/itunes";
import type { SearchApiResponse } from "@/types/media";

export async function GET(
  request: NextRequest,
): Promise<NextResponse<SearchApiResponse>> {
  const searchParams = request.nextUrl.searchParams;
  const term = searchParams.get("term");

  // Validate term parameter
  if (!term || term.trim() === "") {
    return NextResponse.json(
      { success: false, error: "Search term is required" },
      { status: 400 },
    );
  }

  const searchTerm = term.trim();

  try {
    /**
     * Fetch results from iTunes API
     */
    const iTunesResults = await searchItunes(searchTerm);

    /**
     * Normalize results and filter out invalid ones
     */
    const normalizedResults = iTunesResults
      .map((result) => normalizeITunesResult(result, searchTerm))
      .filter((item): item is NonNullable<typeof item> => item !== null);

    // Upsert each item in parallel
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

    return NextResponse.json({
      success: true,
      data: storedItems,
      count: storedItems.length,
      term: searchTerm,
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
