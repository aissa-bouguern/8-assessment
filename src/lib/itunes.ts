import type { ITunesSearchResponse, ITunesResult } from "@/types/itunes";

const ITUNES_API_BASE = "https://itunes.apple.com";

export async function searchItunes(
  term: string,
  limit: number = 50
): Promise<ITunesResult[]> {
  const params = new URLSearchParams({
    term,
    limit: limit.toString(),
    media: "all",
  });

  const response = await fetch(`${ITUNES_API_BASE}/search?${params}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`iTunes API error: ${response.status}`);
  }

  const data: ITunesSearchResponse = await response.json();
  return data.results;
}

export interface NormalizedMediaItem {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl: string | null;
  collectionName: string | null;
  kind: string;
  trackPrice: number | null;
  currency: string | null;
  primaryGenreName: string | null;
  trackViewUrl: string | null;
  previewUrl: string | null;
  releaseDate: Date | null;
  searchTerm: string;
}

export function normalizeITunesResult(
  result: ITunesResult,
  searchTerm: string
): NormalizedMediaItem | null {
  // Get the unique ID - tracks use trackId, collections use collectionId
  const trackId = result.trackId ?? result.collectionId;

  if (!trackId) {
    return null;
  }

  // Get the name - tracks use trackName, collections use collectionName
  const trackName = result.trackName ?? result.collectionName;

  if (!trackName) {
    return null;
  }

  // Determine the kind/type of media
  let kind = result.kind ?? result.wrapperType ?? "unknown";

  // Normalize wrapper types to more specific kinds
  if (kind === "collection") {
    kind = "album";
  } else if (kind === "audiobook") {
    kind = "audiobook";
  }

  // Get artwork URL - prefer larger sizes
  const artworkUrl =
    result.artworkUrl600 ??
    result.artworkUrl100 ??
    result.artworkUrl60 ??
    result.artworkUrl30 ??
    null;

  // Get price - tracks use trackPrice, collections use collectionPrice
  const trackPrice = result.trackPrice ?? result.collectionPrice ?? null;

  // Get view URL
  const trackViewUrl =
    result.trackViewUrl ?? result.collectionViewUrl ?? result.artistViewUrl ?? null;

  // Parse release date
  let releaseDate: Date | null = null;
  if (result.releaseDate) {
    const parsed = new Date(result.releaseDate);
    if (!isNaN(parsed.getTime())) {
      releaseDate = parsed;
    }
  }

  return {
    trackId,
    trackName,
    artistName: result.artistName ?? "Unknown Artist",
    artworkUrl,
    collectionName: result.collectionName ?? null,
    kind,
    trackPrice,
    currency: result.currency ?? null,
    primaryGenreName: result.primaryGenreName ?? null,
    trackViewUrl,
    previewUrl: result.previewUrl ?? null,
    releaseDate,
    searchTerm,
  };
}
