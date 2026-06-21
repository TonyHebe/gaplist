export type PlatformId =
  | "reddit"
  | "g2"
  | "capterra"
  | "app-store"
  | "hacker-news"
  | "product-hunt";

export type PlatformStatus = "live" | "soon";

export type Platform = {
  id: PlatformId;
  name: string;
  status: PlatformStatus;
  description: string;
};

export const PLATFORMS: Platform[] = [
  {
    id: "reddit",
    name: "Reddit",
    status: "live",
    description: "Raw founder pain from startup subreddits.",
  },
  {
    id: "g2",
    name: "G2",
    status: "soon",
    description: "B2B software complaints and review gaps.",
  },
  {
    id: "capterra",
    name: "Capterra",
    status: "soon",
    description: "Software buyer frustrations and feature ratings.",
  },
  {
    id: "app-store",
    name: "App Store",
    status: "soon",
    description: "Mobile app negative reviews and missing features.",
  },
  {
    id: "hacker-news",
    name: "Hacker News",
    status: "soon",
    description: "Builder discussions and unmet tool requests.",
  },
  {
    id: "product-hunt",
    name: "Product Hunt",
    status: "soon",
    description: "Launch comments and product wishlists.",
  },
];
