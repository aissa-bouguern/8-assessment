"use client";

import Image from "next/image";
import { cn, formatPrice, truncate } from "@/lib/utils";
import { MEDIA_TYPE_BADGES, type MediaItem } from "@/types/media";

interface MediaCardProps {
  item: MediaItem;
}

export function MediaCard({ item }: MediaCardProps) {
  const badge = MEDIA_TYPE_BADGES[item.kind] || MEDIA_TYPE_BADGES.default;

  return (
    <a
      href={item.trackViewUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="card group block overflow-hidden rounded-2xl bg-[#151528] shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-[#1a1a2e]">
        {item.artworkUrl ? (
          <Image
            src={item.artworkUrl}
            alt={item.trackName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg
              className="h-16 w-16 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </div>
        )}

        <span
          className={cn(
            "absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium",
            badge.color,
          )}
        >
          {badge.label}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-white line-clamp-2">
          {truncate(item.trackName, 50)}
        </h3>
        <p className="mt-1 text-sm text-pink-500 line-clamp-1">
          {item.artistName}
        </p>

        {item.collectionName && item.collectionName !== item.trackName && (
          <p className="mt-1 text-xs text-gray-500 line-clamp-1">
            {item.collectionName}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-medium text-blue-400">
            {formatPrice(item.trackPrice, item.currency)}
          </span>
          {item.primaryGenreName && (
            <span className="text-xs text-gray-500">
              {item.primaryGenreName}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
