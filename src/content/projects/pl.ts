import type { ProjectSlug } from "./slugs";
import type { ProjectCopy } from "./types";

export const projectsPl: Readonly<Record<ProjectSlug, ProjectCopy>> = {
  nexus: {
    description:
      "Przestrzeń do obsługi zgłoszeń: AI analizuje ticket i proponuje odpowiedź na podstawie bazy wiedzy, a człowiek ją zatwierdza.",
  },
  "support-tickets": {
    description:
      "Helpdesk z trzema rolami, historią zmian każdego zgłoszenia, filtrami zapisanymi w URL i testami E2E. Poprzednik NEXUS.",
  },
  "twoj-doradca": {
    description:
      "Landing page dla firmy doradztwa OZE z wielokrokowym formularzem, który zadaje inne pytania dla każdego z 6 produktów.",
  },
  fotoroman: {
    description:
      "Strona ze zdjęciami mojego taty. Pierwsza wersja w czystym JS, obecna w Next.js z galerią z Cloudinary.",
  },
  postly: {
    description: "Forum w Vue 3 i Vuex — projekt do porównania ekosystemu Vue z Reactem.",
  },
  "sliding-puzzle": {
    description: "Gra 15-puzzle w React z gwarancją, że każdą planszę da się ułożyć.",
  },
  "portfolio-v1": {
    description: "Moje pierwsze portfolio. Jego ograniczenia stały się wymaganiami dla tej strony.",
  },
};