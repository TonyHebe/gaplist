import type { Metadata } from "next";
import { UtmCapture } from "@/components/UtmCapture";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://findtrueideas.com";

export const metadata: Metadata = {
  title: "TrueIdeas — Find startup ideas from real Reddit complaints",
  description:
    "Free beta for founders. TrueIdeas scans Reddit for real complaints and unmet needs — so you can find problems worth building for.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "TrueIdeas — Find startup ideas from real Reddit complaints",
    description:
      "Scan Reddit for founder pain points. Search, save, and shortlist threads worth building for.",
    url: siteUrl,
    siteName: "TrueIdeas",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrueIdeas — Find startup ideas from real Reddit complaints",
    description:
      "Scan Reddit for founder pain points. Search, save, and shortlist threads worth building for.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <UtmCapture />
        {children}
      </body>
    </html>
  );
}
