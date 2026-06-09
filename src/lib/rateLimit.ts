import "server-only";

// ════════════════════════════════════════════════════════════════
// Per-key fixed-window rate limit.
//
// This in-memory version is correct for a single instance and fine for
// early launch. On Vercel's serverless/edge runtime each instance has
// its own memory, so for real protection swap the Map for a shared
// store (Upstash Redis / @upstash/ratelimit) — same interface.
// ════════════════════════════════════════════════════════════════

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export type RateResult = { ok: boolean; remaining: number; retryAfterMs?: number };

export function rateLimit(key: string, limit: number, windowMs: number): RateResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  if (bucket.count >= limit) {
    return { ok: false, remaining: 0, retryAfterMs: bucket.resetAt - now };
  }
  bucket.count += 1;
  return { ok: true, remaining: limit - bucket.count };
}
