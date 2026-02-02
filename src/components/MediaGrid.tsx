"use client";

import { MediaCard } from "./MediaCard";
import type { MediaItem } from "@/types/media";

interface MediaGridProps {
  items: MediaItem[];
}

export function MediaGrid({ items }: MediaGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <MediaCard key={item.id} item={item} />
      ))}
    </div>
  );
}
