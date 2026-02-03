import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { MediaList } from "./MediaList";
import { truncate } from "@/lib/utils";
import type { MediaItem } from "@/types/media";

interface EpisodesSectionProps {
  searchTerm: string;
  episodes: MediaItem[];
  layout: "list" | "grid";
}

function CompactCard({ item }: { item: MediaItem }) {
  const [showMenu, setShowMenu] = useState(false);
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

  return (
    <div className="flex items-center gap-3 py-2 transition-colors hover:bg-[#1a1a2e] border-b border-gray-800 relative">
      <a
        href={item.trackViewUrl || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 min-w-0 flex-1"
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
          <p className="line-clamp-1 text-xs text-pink-500">
            {item.artistName}
          </p>
        </div>
      </a>
      <div className="absolute top-2 right-0" ref={menuRef}>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-[#1a1a2e] hover:text-white"
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
          <div className="absolute right-0 z-50 mt-1 w-32 rounded-lg bg-[#1a1a2e] py-1 shadow-lg ring-1 ring-gray-700">
            <button
              type="button"
              className="w-full px-3 py-2 text-left text-xs text-gray-300 transition-colors hover:bg-[#2a2a4a] hover:text-white"
              onClick={() => setShowMenu(false)}
            >
              Add to Queue
            </button>
            <button
              type="button"
              className="w-full px-3 py-2 text-left text-xs text-gray-300 transition-colors hover:bg-[#2a2a4a] hover:text-white"
              onClick={() => setShowMenu(false)}
            >
              Share
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function GridEpisodeCard({ item }: { item: MediaItem }) {
  const [showMenu, setShowMenu] = useState(false);
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

  return (
    <div
      key={item.id}
      className="relative rounded-lg bg-[#1a1a2e] flex items-center group transition-colors hover:bg-[#2a2a4a]"
    >
      <div className="relative h-full w-24 flex-shrink-0 overflow-hidden rounded-l-lg">
        {item.artworkUrl ? (
          <Image
            src={item.artworkUrl}
            alt={item.trackName}
            fill
            sizes="80px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#2a2a4a]">
            <svg
              className="h-8 w-8 text-gray-600"
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
      <div className="flex-1 min-w-0 p-3">
        <a
          href={item.trackViewUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <p className="text-xs text-pink-500 mb-1">Podcast Episode</p>
          <p className="line-clamp-1 text-sm font-medium text-white mb-1">
            {truncate(item.trackName, 60)}
          </p>
          <p className="line-clamp-1 text-xs text-gray-400 mb-2">
            {item.artistName}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Episode 42</span>
            <span>•</span>
            <span>45 min</span>
          </div>
        </a>
      </div>
      <div className="absolute top-2 right-2" ref={menuRef}>
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
          <div className="absolute right-0 z-50 mt-1 w-32 rounded-lg bg-[#1a1a2e] py-1 shadow-lg ring-1 ring-gray-700">
            <button
              type="button"
              className="w-full px-3 py-2 text-left text-xs text-gray-300 transition-colors hover:bg-[#2a2a4a] hover:text-white"
              onClick={() => setShowMenu(false)}
            >
              Add to Queue
            </button>
            <button
              type="button"
              className="w-full px-3 py-2 text-left text-xs text-gray-300 transition-colors hover:bg-[#2a2a4a] hover:text-white"
              onClick={() => setShowMenu(false)}
            >
              Share
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function EpisodeCard({ item }: { item: MediaItem }) {
  const [showMenu, setShowMenu] = useState(false);
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

  return (
    <div className="relative rounded-lg bg-[#1a1a2e] flex items-center group flex-shrink-0 snap-start w-80 min-h-20 transition-colors hover:bg-[#2a2a4a]">
      <div className="relative h-full w-24 flex-shrink-0 overflow-hidden rounded-l-lg">
        {item.artworkUrl ? (
          <Image
            src={item.artworkUrl}
            alt={item.trackName}
            fill
            sizes="80px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-20 items-center justify-center bg-[#2a2a4a]">
            <svg
              className="h-8 w-8 text-gray-600"
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
      <div className="flex-1 min-w-0 p-3">
        <a
          href={item.trackViewUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <p className="text-xs text-pink-500 mb-1">Podcast Episode</p>
          <p className="line-clamp-1 text-sm font-medium text-white mb-1">
            {truncate(item.trackName, 60)}
          </p>
          <p className="line-clamp-1 text-xs text-gray-400 mb-2">
            {item.artistName}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Episode 42</span>
            <span>•</span>
            <span>45 min</span>
          </div>
        </a>
      </div>
      <div className="absolute top-2 right-2" ref={menuRef}>
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
          <div
            className="absolute right-0 z-50 mt-1 w-32 rounded-lg bg-[#1a1a2e] py-1 shadow-lg ring-1 ring-gray-700"
            ref={menuRef}
          >
            <button
              type="button"
              className="w-full px-3 py-2 text-left text-xs text-gray-300 transition-colors hover:bg-[#2a2a4a] hover:text-white"
              onClick={() => setShowMenu(false)}
            >
              Add to Queue
            </button>
            <button
              type="button"
              className="w-full px-3 py-2 text-left text-xs text-gray-300 transition-colors hover:bg-[#2a2a4a] hover:text-white"
              onClick={() => setShowMenu(false)}
            >
              Share
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function EpisodesSection({
  searchTerm,
  episodes,
}: EpisodesSectionProps) {
  const [sectionLayout, setSectionLayout] = useState<
    "compact" | "grid" | "scroll"
  >("compact");
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

  if (episodes.length === 0) return null;

  return (
    <section className="relative">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-md font-semibold text-white">
          Top episodes for {searchTerm}
        </h2>
        <div className="flex items-center gap-2">
          {sectionLayout === "scroll" && (
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
                    sectionLayout === "compact"
                      ? "bg-[#2a2a4a] text-white"
                      : "text-gray-300 hover:bg-[#2a2a4a] hover:text-white"
                  }`}
                  onClick={() => {
                    setSectionLayout("compact");
                    setShowMenu(false);
                  }}
                >
                  Compact Layout
                </button>
                <button
                  type="button"
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                    sectionLayout === "scroll"
                      ? "bg-[#2a2a4a] text-white"
                      : "text-gray-300 hover:bg-[#2a2a4a] hover:text-white"
                  }`}
                  onClick={() => {
                    setSectionLayout("scroll");
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

      {sectionLayout === "compact" ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {episodes.map((item) => (
            <CompactCard key={item.id} item={item} />
          ))}
        </div>
      ) : sectionLayout === "scroll" ? (
        <div
          ref={scrollContainerRef}
          className="media-list-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain pb-4"
        >
          {episodes.map((item) => (
            <EpisodeCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {episodes.map((item) => (
            <GridEpisodeCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
