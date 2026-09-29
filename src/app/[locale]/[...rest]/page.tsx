import { notFound } from "next/navigation";

/**
 * Catch-all: każda nieznana ścieżka pod /pl/... i /en/...
 * trafia tutaj i kieruje do zlokalizowanego [locale]/not-found.tsx.
 * Bez tego Next pokazałby swój domyślny, anglojęzyczny 404.
 */
export default function CatchAllPage() {
  notFound();
}
