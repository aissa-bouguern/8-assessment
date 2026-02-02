import type { MediaItem } from "@prisma/client";

export type { MediaItem };

export interface SearchApiResponse {
  success: boolean;
  data?: MediaItem[];
  count?: number;
  term?: string;
  error?: string;
}

export const MEDIA_TYPE_BADGES: Record<string, { label: string; color: string }> = {
  song: { label: "Song", color: "bg-pink-100 text-pink-800" },
  "music-video": { label: "Music Video", color: "bg-purple-100 text-purple-800" },
  podcast: { label: "Podcast", color: "bg-green-100 text-green-800" },
  "podcast-episode": { label: "Episode", color: "bg-emerald-100 text-emerald-800" },
  audiobook: { label: "Audiobook", color: "bg-amber-100 text-amber-800" },
  "feature-movie": { label: "Movie", color: "bg-blue-100 text-blue-800" },
  movie: { label: "Movie", color: "bg-blue-100 text-blue-800" },
  "tv-episode": { label: "TV Episode", color: "bg-indigo-100 text-indigo-800" },
  album: { label: "Album", color: "bg-rose-100 text-rose-800" },
  ebook: { label: "eBook", color: "bg-orange-100 text-orange-800" },
  software: { label: "App", color: "bg-cyan-100 text-cyan-800" },
  default: { label: "Media", color: "bg-gray-100 text-gray-800" },
};
