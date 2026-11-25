export type RateLimiterOptions = {
  /** Maximum number of hits allowed per key within the window. */
  limit: number;
  /** Sliding window length in milliseconds. */
  windowMs: number;
  /** Upper bound on tracked keys so memory cannot grow without limit. */
  maxKeys?: number;
  now?: () => number;
};

export type RateLimitResult =
  | { allowed: true; remaining: number }
  | { allowed: false; retryAfterMs: number };

/**
 * In-memory sliding-window rate limiter. State lives in the current server
 * instance only, so it is a best-effort spam guard rather than a hard quota.
 */
export function createRateLimiter({
  limit,
  windowMs,
  maxKeys = 5000,
  now = Date.now,
}: RateLimiterOptions) {
  const hits = new Map<string, number[]>();

  function prune(currentTime: number) {
    for (const [key, timestamps] of hits) {
      if (timestamps.every((time) => currentTime - time >= windowMs)) {
        hits.delete(key);
      }
    }
  }

  return {
    check(key: string): RateLimitResult {
      const currentTime = now();
      const recent = (hits.get(key) ?? []).filter(
        (time) => currentTime - time < windowMs,
      );

      if (recent.length >= limit) {
        hits.set(key, recent);
        const oldest = recent[0] ?? currentTime;

        return {
          allowed: false,
          retryAfterMs: Math.max(0, windowMs - (currentTime - oldest)),
        };
      }

      if (!hits.has(key) && hits.size >= maxKeys) {
        prune(currentTime);

        if (hits.size >= maxKeys) {
          const oldestKey = hits.keys().next().value;

          if (oldestKey !== undefined) {
            hits.delete(oldestKey);
          }
        }
      }

      recent.push(currentTime);
      hits.set(key, recent);

      return { allowed: true, remaining: limit - recent.length };
    },
    reset() {
      hits.clear();
    },
  };
}
