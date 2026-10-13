import type { StaticImageData } from "next/image";
import type { Locale } from "next-intl";
import fotoroman from "./images/fotoroman.webp";
import nexus from "./images/nexus.webp";
import supportTickets from "./images/support-tickets.webp";
import twojDoradca from "./images/twoj-doradca.webp";
import type { ProjectSlug } from "./slugs";

interface ScreenshotSource {
  image: StaticImageData;
  alt: Readonly<Record<Locale, string>>;
}

export interface ProjectScreenshot {
  image: StaticImageData;
  alt: string;
}

const SCREENSHOTS: Readonly<Partial<Record<ProjectSlug, ScreenshotSource>>> = {
  nexus: {
    image: nexus,
    alt: {
      pl: "Strona startowa NEXUS: po lewej opis i statystyki, po prawej zgłoszenie „Problem z logowaniem” z analizą AI (kategoria, priorytet, pewność) i sugerowaną odpowiedzią do zatwierdzenia.",
      en: "NEXUS landing page: a description and stats on the left, and on the right a “Login problem” ticket with AI analysis (category, priority, confidence) and a suggested reply awaiting approval.",
    },
  },
  "support-tickets": {
    image: supportTickets,
    alt: {
      pl: "Lista zgłoszeń w Support Tickets Dashboard z wyszukiwarką, filtrami statusu i priorytetu oraz kolumnami: status, priorytet, osoba przypisana, kategoria i data.",
      en: "Support Tickets Dashboard ticket list with search, status and priority filters, and columns for status, priority, assignee, category and date.",
    },
  },
  "twoj-doradca": {
    image: twojDoradca,
    alt: {
      pl: "Strona główna Twój Doradca: hasło „Zła decyzja w OZE kosztuje dziesiątki tysięcy złotych”, przycisk bezpłatnej konsultacji i panele fotowoltaiczne na dachu w tle.",
      en: "Twój Doradca home page: the headline “A bad renewable energy decision costs tens of thousands of złoty”, a free consultation button and rooftop solar panels in the background.",
    },
  },
  fotoroman: {
    image: fotoroman,
    alt: {
      pl: "Strona główna Fotoroman: zdjęcie latarni morskiej na wydmach o zachodzie słońca z cytatem Terence’a Donovana.",
      en: "Fotoroman home page: a photo of a lighthouse on sand dunes at sunset with a quote by Terence Donovan.",
    },
  },
};

export function getScreenshot(slug: ProjectSlug, locale: Locale): ProjectScreenshot | null {
  const source = SCREENSHOTS[slug];
  return source ? { image: source.image, alt: source.alt[locale] } : null;
}