"use client";

import { useState, useEffect } from "react";

interface LoadingSpinnerProps {
  delay?: number;
}

export function LoadingSpinner({ delay = 300 }: LoadingSpinnerProps) {
  const [show, setShow] = useState(delay === 0);

  useEffect(() => {
    if (delay === 0) return;

    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return null;

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative h-20 w-20">
        <div className="absolute inset-0 rounded-full border-2 border-purple-400 animate-spinner-grow-1"></div>
        <div className="absolute inset-2 rounded-full border-2 border-purple-300 animate-spinner-grow-2"></div>
        <div className="absolute inset-4 rounded-full border-2 border-pink-400 animate-spinner-grow-3"></div>
      </div>
    </div>
  );
}
