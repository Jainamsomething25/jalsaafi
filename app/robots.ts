import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/control-center" },
    ],
    sitemap: "https://jalsaafi.vercel.app/sitemap.xml",
  };
}
