export interface GeoPoint {
  countryCode: string;
  latitude: number;
  longitude: number;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  location: GeoPoint;
  links: {
    github: string;
    linkedin: string | null;
    email: string | null;
  };
}

export const siteConfig = {
  name: "Adam Giszter",
  shortName: "Giszter",
  location: { countryCode: "PL", latitude: 52, longitude: 16 },
  links: {
    github: "https://github.com/Giszta",
    linkedin: "https://www.linkedin.com/in/adam-giszter/",
    email: "a.m.giszter@gmail.com",
  },
} satisfies SiteConfig;
