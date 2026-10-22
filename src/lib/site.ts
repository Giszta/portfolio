const LOCAL_URL = "http://localhost:3000";

/**
 * Adres bazowy strony (canonical, Open Graph, sitemap). Kolejność:
 * 1. NEXT_PUBLIC_SITE_URL — własna domena,
 * 2. VERCEL_PROJECT_PRODUCTION_URL — adres produkcyjny, który Vercel ustawia sam (bez protokołu),
 * 3. localhost.
 */
export function resolveSiteUrl(env: Readonly<Record<string, string | undefined>>): URL {
  const explicit = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return new URL(explicit);

  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return new URL(`https://${vercel}`);

  return new URL(LOCAL_URL);
}

export const siteUrl = resolveSiteUrl(process.env);
