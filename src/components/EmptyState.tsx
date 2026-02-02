"use client";

interface EmptyStateProps {
  type: "idle" | "empty" | "error";
  message?: string;
}

export function EmptyState({ type, message }: EmptyStateProps) {
  const config = {
    idle: {
      icon: (
        <svg
          className="h-16 w-16 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
      title: "Start your search",
      description: "Search for songs, podcasts, movies, audiobooks and more",
    },
    empty: {
      icon: (
        <svg
          className="h-16 w-16 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "No results found",
      description: message || "Try a different search term",
    },
    error: {
      icon: (
        <svg
          className="h-16 w-16 text-red-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
      title: "Something went wrong",
      description: message || "Please try again later",
    },
  };

  const { icon, title, description } = config[type];

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon}
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-500">{description}</p>
    </div>
  );
}
