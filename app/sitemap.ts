import type { MetadataRoute } from "next";
import { siteRoutes } from "@/lib/data/routes";

const BASE_URL = "https://jalsaafi.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return siteRoutes.map((route) => ({
    url: `${BASE_URL}${route.href}`,
    changeFrequency: "weekly",
    priority: route.href === "/" ? 1 : 0.7,
  }));
}
