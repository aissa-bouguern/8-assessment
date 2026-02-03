"use client";

import Image from "next/image";
import { truncate } from "@/lib/utils";
import type { MediaItem } from "@/types/media";

interface MediaListProps {
  title: string;
  items: MediaItem[];
  layout: "list" | "grid";
  variant: "featured" | "compact";
}

export function MediaList({ title, items, layout, variant }: MediaListProps) {
  if (layout === "grid") {
    return (
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1a2e] text-gray-400 transition-colors hover:bg-[#2a2a4a] hover:text-white"
              aria-label="Previous"
            >
              <svg
                className="h-4 w-4"
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
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1a2e] text-gray-400 transition-colors hover:bg-[#2a2a4a] hover:text-white"
              aria-label="Next"
            >
              <svg
                className="h-4 w-4"
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
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-[#1a1a2e] hover:text-white"
              aria-label="More options"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Grid */}
        <div className="hide-scrollbar -mx-6 flex gap-4 overflow-x-auto px-6 pb-4">
          {items.map((item) => (
            <FeaturedCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    );
  }

  // List layout
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>

      {variant === "featured" ? (
        <div className="hide-scrollbar -mx-6 flex gap-4 overflow-x-auto px-6 pb-4">
          {items.map((item) => (
            <FeaturedCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <CompactCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

function FeaturedCard({ item }: { item: MediaItem }) {
  return (
    <a
      href={item.trackViewUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex-shrink-0"
    >
      <div className="relative h-40 w-40 overflow-hidden rounded-lg bg-[#1a1a2e]">
        {item.artworkUrl ? (
          <Image
            src={item.artworkUrl}
            alt={item.trackName}
            fill
            sizes="160px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg
              className="h-12 w-12 text-gray-600"
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
      </div>
      <div className="mt-2 w-40">
        <p className="line-clamp-1 text-sm font-medium text-white">
          {truncate(item.trackName, 30)}
        </p>
        <p className="line-clamp-1 text-xs text-pink-500">{item.artistName}</p>
      </div>
    </a>
  );
}

function CompactCard({ item }: { item: MediaItem }) {
  return (
    <a
      href={item.trackViewUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-[#1a1a2e]"
    >
      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-[#1a1a2e]">
        {item.artworkUrl ? (
          <Image
            src={item.artworkUrl}
            alt={item.trackName}
            fill
            sizes="48px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg
              className="h-6 w-6 text-gray-600"
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
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-sm font-medium text-white">
          {truncate(item.trackName, 40)}
        </p>
        <p className="line-clamp-1 text-xs text-pink-500">{item.artistName}</p>
      </div>
    </a>
  );
}
