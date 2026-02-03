import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { MediaList } from "./MediaList";
import { truncate } from "@/lib/utils";
import type { MediaItem } from "@/types/media";

interface PodcastsSectionProps {
  searchTerm: string;
  podcasts: MediaItem[];
  layout: "list" | "grid";
}

function FeaturedCard({ item }: { item: MediaItem }) {
  return (
    <a
      href={item.trackViewUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex-shrink-0 snap-start"
    >
      <div className="relative h-56 w-56 overflow-hidden rounded-lg bg-[#1a1a2e]">
        {item.artworkUrl ? (
          <Image
            src={item.artworkUrl}
            alt={item.trackName}
            fill
            sizes="224px"
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
      <div className="mt-2 w-56">
        <p className="line-clamp-1 text-sm font-medium text-white">
          {truncate(item.trackName, 30)}
        </p>
        <p className="line-clamp-1 text-xs text-pink-500">{item.artistName}</p>
      </div>
    </a>
  );
}

export function PodcastsSection({
  searchTerm,
  podcasts,
  layout,
}: PodcastsSectionProps) {
  const [sectionLayout, setSectionLayout] = useState<"list" | "grid">(layout);
  const [showMenu, setShowMenu] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const visibleWidth = container.clientWidth;
      const maxScroll = container.scrollWidth - container.clientWidth;
      const scrollAmount = Math.min(visibleWidth, maxScroll);

      if (scrollAmount > 0) {
        container.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };

  if (podcasts.length === 0) return null;

  return (
    <section className="relative">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-md font-semibold text-white">
          Top podcasts for {searchTerm}
        </h2>
        <div className="flex items-center gap-2">
          {sectionLayout === "list" && (
            <>
              <button
                type="button"
                onClick={() => scroll("left")}
                className="cursor-pointer text-gray-400 transition-colors hover:text-white"
                aria-label="Previous"
              >
                <svg
                  className="h-5 w-5"
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
                onClick={() => scroll("right")}
                className="cursor-pointer text-gray-400 transition-colors hover:text-white"
                aria-label="Next"
              >
                <svg
                  className="h-5 w-5"
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
            </>
          )}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-[#1a1a2e] hover:text-white"
              onClick={() => setShowMenu(!showMenu)}
              aria-label="More options"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </button>

            {showMenu && (
              <div className="absolute right-0 z-50 mt-1 w-48 rounded-lg bg-[#1a1a2e] py-1 shadow-lg ring-1 ring-gray-700">
                <button
                  type="button"
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                    sectionLayout === "list"
                      ? "bg-[#2a2a4a] text-white"
                      : "text-gray-300 hover:bg-[#2a2a4a] hover:text-white"
                  }`}
                  onClick={() => {
                    setSectionLayout("list");
                    setShowMenu(false);
                  }}
                >
                  Scroll Layout
                </button>
                <button
                  type="button"
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                    sectionLayout === "grid"
                      ? "bg-[#2a2a4a] text-white"
                      : "text-gray-300 hover:bg-[#2a2a4a] hover:text-white"
                  }`}
                  onClick={() => {
                    setSectionLayout("grid");
                    setShowMenu(false);
                  }}
                >
                  Grid Layout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {sectionLayout === "list" ? (
        <div
          ref={scrollContainerRef}
          className="media-list-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-4"
        >
          {podcasts.map((item) => (
            <FeaturedCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {podcasts.map((item) => (
            <div key={item.id} className="group">
              <a
                href={item.trackViewUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="relative aspect-square overflow-hidden rounded-lg bg-[#1a1a2e]">
                  {item.artworkUrl ? (
                    <Image
                      src={item.artworkUrl}
                      alt={item.trackName}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 16vw"
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
                <div className="mt-2">
                  <p className="line-clamp-1 text-sm font-medium text-white">
                    {truncate(item.trackName, 30)}
                  </p>
                  <p className="line-clamp-1 text-xs text-pink-500">
                    {item.artistName}
                  </p>
                </div>
              </a>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
