import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "iTunes Search | Thmanyah",
  description:
    "Search for songs, podcasts, movies, audiobooks and more from the iTunes catalog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={ibmPlexSansArabic.variable}>
      <body className="min-h-screen bg-[#0d0d1a] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
