import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | null | undefined, currency?: string | null): string {
  if (price === null || price === undefined || price === 0) {
    return "Free";
  }

  const currencyCode = currency || "USD";

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(price);
  } catch {
    return `${currencyCode} ${price.toFixed(2)}`;
  }
}

export function isRTL(text: string): boolean {
  // Check for Arabic (0600-06FF) or Hebrew (0590-05FF) Unicode ranges
  const rtlPattern = /[\u0600-\u06FF\u0590-\u05FF]/;
  return rtlPattern.test(text);
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + "…";
}

export function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return "";

  const date = typeof dateString === "string" ? new Date(dateString) : dateString;

  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
