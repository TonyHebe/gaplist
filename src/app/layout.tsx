import type { Metadata } from "next";
import { UtmCapture } from "@/components/UtmCapture";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gaplist.vercel.app";

export const metadata: Metadata = {
  title: "GapList — Find startup ideas from Reddit problems",
  description:
    "Free beta for founders. GapList scans Reddit for real complaints and unmet needs — so you can find problems worth building for.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "GapList — Find startup ideas from Reddit problems",
    description:
      "Scan Reddit for founder pain points. Search, save, and shortlist threads worth building for.",
    url: siteUrl,
    siteName: "GapList",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GapList — Find startup ideas from Reddit problems",
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
