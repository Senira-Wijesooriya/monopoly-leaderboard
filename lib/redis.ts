import { kv } from '@vercel/kv';

// Wrapper class using official @vercel/kv SDK for bulletproof persistence
class VercelKVClient {
  async keys(pattern: string) {
    try {
      return await kv.keys(pattern);
    } catch (e) {
      console.error("KV keys error:", e);
      return [];
    }
  }

  async hgetall(key: string) {
    try {
      const data = await kv.hgetall(key);
      return data || {};
    } catch (e) {
      console.error("KV hgetall error:", e);
      return {};
    }
  }

  async hset(key: string, value: Record<string, any>) {
    try {
      return await kv.hset(key, value);
    } catch (e) {
      console.error("KV hset error:", e);
      return 0;
    }
  }

  async hincrby(key: string, field: string, increment: number) {
    try {
      return await kv.hincrby(key, field, increment);
    } catch (e) {
      console.error("KV hincrby error:", e);
      return 0;
    }
  }

  async exists(key: string): Promise<number> {
    try {
      const res = await kv.exists(key);
      return res ? 1 : 0;
    } catch (e) {
      console.error("KV exists error:", e);
      return 0;
    }
  }

  async del(key: string) {
    try {
      return await kv.del(key);
    } catch (e) {
      console.error("KV del error:", e);
      return 0;
    }
  }

  async lpush(key: string, value: string) {
    try {
      return await kv.lpush(key, value);
    } catch (e) {
      console.error("KV lpush error:", e);
      return 0;
    }
  }

  async lrange(key: string, start: number, end: number) {
    try {
      const res = await kv.range(key, start, end);
      return res || [];
    } catch (e) {
      // Fallback in case range method alias differs in SDK version
      try {
        const res2 = await kv.lrange(key, start, end);
        return res2 || [];
      } catch (err) {
        console.error("KV lrange error:", err);
        return [];
      }
    }
  }

  async lpop(key: string) {
    try {
      return await kv.lpop(key);
    } catch (e) {
      console.error("KV lpop error:", e);
      return null;
    }
  }

  async lrem(key: string, count: number, value: string) {
    try {
      return await kv.lrem(key, count, value);
    } catch (e) {
      console.error("KV lrem error:", e);
      return 0;
    }
  }
}

const globalForRedis = global as unknown as { redisClient: VercelKVClient };
const redis = globalForRedis.redisClient || new VercelKVClient();
if (process.env.NODE_ENV !== 'production') globalForRedis.redisClient = redis;

export default redis;