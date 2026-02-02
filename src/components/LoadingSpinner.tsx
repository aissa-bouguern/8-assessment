"use client";

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = "Loading..." }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-gray-200"></div>
        <div className="absolute left-0 top-0 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
      <p className="mt-4 text-gray-500">{message}</p>
    </div>
  );
}
