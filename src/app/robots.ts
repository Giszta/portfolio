import type { MetadataRoute } from "next";
import { buildRobots } from "@/lib/seo/sitemap";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return buildRobots(siteUrl);
}
