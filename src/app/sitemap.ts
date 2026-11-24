import type { MetadataRoute } from "next";
import { getRoots } from "@/lib/roots";
import { siteUrl } from "@/lib/site-url";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const roots = await getRoots();
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/portraits`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/collections/roots-on-the-road`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/map`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/add`, changeFrequency: "monthly", priority: 0.5 },
    ...roots.map((r) => ({
      url: `${siteUrl}/roots/${r.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
