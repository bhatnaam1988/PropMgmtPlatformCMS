import { LRUCache } from 'lru-cache';

/**
 * Rate limiting utilities
 * Uses in-memory LRU cache for tracking requests
 */

const tokenCache = new LRUCache({
  max: 500,
  ttl: 60000, // 1 minute
});

export function rateLimit(options = {}) {
  const {
    uniqueTokenPerInterval = 500,
    interval = 60000,
  } = options;

  return {
    check: async (limit, token) => {
      const tokenCount = tokenCache.get(token) || [0];
      
      if (tokenCount[0] === 0) {
        tokenCache.set(token, [1], { ttl: interval });
      }
      
      tokenCount[0] += 1;
      
      const currentUsage = tokenCount[0];
      const isRateLimited = currentUsage > limit;
      
      return {
        isRateLimited,
        limit,
        remaining: Math.max(0, limit - currentUsage),
        reset: Date.now() + interval,
      };
    },
  };
}
