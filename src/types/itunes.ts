export interface ITunesSearchResponse {
  resultCount: number;
  results: ITunesResult[];
}

export interface ITunesResult {
  wrapperType?: string;
  kind?: string;

  // Track-based items (songs, music videos, etc.)
  trackId?: number;
  trackName?: string;
  trackPrice?: number;
  trackViewUrl?: string;

  // Collection-based items (albums, audiobooks, podcasts)
  collectionId?: number;
  collectionName?: string;
  collectionPrice?: number;
  collectionViewUrl?: string;

  // Common fields
  artistId?: number;
  artistName?: string;
  artistViewUrl?: string;

  // Artwork URLs (different sizes)
  artworkUrl30?: string;
  artworkUrl60?: string;
  artworkUrl100?: string;
  artworkUrl600?: string;

  // Additional metadata
  primaryGenreName?: string;
  releaseDate?: string;
  currency?: string;
  previewUrl?: string;
  description?: string;
  longDescription?: string;

  // Podcast specific
  feedUrl?: string;
  trackCount?: number;

  // Movie/TV specific
  contentAdvisoryRating?: string;
  shortDescription?: string;
}
