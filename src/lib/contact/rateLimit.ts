export interface RateLimiter {
  /** Zużywa jedno zgłoszenie dla klucza; false, gdy limit w oknie czasowym wyczerpany. */
  take(key: string): boolean;
}

interface RateLimiterOptions {
  limit: number;
  windowMs: number;
  now?: () => number;
}

const PRUNE_ABOVE = 1000;

/**
 * Okno przesuwne w pamięci procesu. Na serverless to „best effort": każda instancja
 * liczy osobno. Wymiana na współdzielony magazyn (Upstash, KV) zmienia tylko tę fabrykę.
 */
export function createRateLimiter({
  limit,
  windowMs,
  now = Date.now,
}: RateLimiterOptions): RateLimiter {
  const hits = new Map<string, number[]>();

  function prune(at: number): void {
    for (const [key, times] of hits) {
      if (times.every((time) => at - time >= windowMs)) hits.delete(key);
    }
  }

  return {
    take(key) {
      const at = now();
      if (hits.size > PRUNE_ABOVE) prune(at);

      const recent = (hits.get(key) ?? []).filter((time) => at - time < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }
      hits.set(key, [...recent, at]);
      return true;
    },
  };
}
