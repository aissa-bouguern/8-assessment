import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "iTunes Search | Thmanyah",
  description: "Search for songs, podcasts, movies, audiobooks and more from the iTunes catalog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 antialiased">{children}</body>
    </html>
  );
}
