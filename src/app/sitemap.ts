import type { MetadataRoute } from "next";
import { buildSitemap } from "@/lib/seo/sitemap";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap(siteUrl);
}
