import type { MetadataRoute } from "next";
import { firma } from "@/data/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${firma.siteUrl}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${firma.siteUrl}/polityka-prywatnosci/`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
