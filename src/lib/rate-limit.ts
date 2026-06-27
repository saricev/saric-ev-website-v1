import { NextRequest } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitOptions {
  windowMs: number;
  max: number;
  keyGenerator?: (request: NextRequest) => string;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
}

export function createRateLimiter(options: RateLimitOptions) {
  const { windowMs, max, keyGenerator } = options;
  const store = new Map<string, RateLimitEntry>();

  // Periodic cleanup to prevent memory leaks
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now > entry.resetAt) store.delete(key);
    }
  }, windowMs * 2);

  return {
    check(request: NextRequest): RateLimitResult {
      const key = keyGenerator ? keyGenerator(request) : getClientIp(request);
      const now = Date.now();
      const entry = store.get(key);

      if (!entry || now > entry.resetAt) {
        store.set(key, { count: 1, resetAt: now + windowMs });
        return { success: true, remaining: max - 1 };
      }

      if (entry.count >= max) {
        return { success: false, remaining: 0 };
      }

      entry.count++;
      return { success: true, remaining: max - entry.count };
    },
  };
}

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}
