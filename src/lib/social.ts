import type { SiteConfig } from "@/content/site";

export type SocialKey = "github" | "linkedin" | "email";

export interface SocialLink {
  key: SocialKey;
  href: string;
}

export function getSocialLinks(links: SiteConfig["links"]): SocialLink[] {
  const result: SocialLink[] = [{ key: "github", href: links.github }];
  if (links.linkedin) result.push({ key: "linkedin", href: links.linkedin });
  if (links.email) result.push({ key: "email", href: `mailto:${links.email}` });
  return result;
}
