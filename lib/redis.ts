import { kv } from '@vercel/kv';

class VercelKVClient {
  async keys(pattern: string): Promise<string[]> {
    try {
      const res = await kv.keys(pattern);
      return (res as string[]) || [];
    } catch (e) {
      console.error("KV keys error:", e);
      return [];
    }
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    try {
      const data = await kv.hgetall(key);
      return (data as Record<string, string>) || {};
    } catch (e) {
      console.error("KV hgetall error:", e);
      return {};
    }
  }

  async hset(key: string, value: Record<string, any>): Promise<number> {
    try {
      const res = await kv.hset(key, value);
      return typeof res === 'number' ? res : 1;
    } catch (e) {
      console.error("KV hset error:", e);
      return 0;
    }
  }

  async hincrby(key: string, field: string, increment: number): Promise<number> {
    try {
      const res = await kv.hincrby(key, field, increment);
      return typeof res === 'number' ? res : 0;
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

  async del(key: string): Promise<number> {
    try {
      const res = await kv.del(key);
      return typeof res === 'number' ? res : 1;
    } catch (e) {
      console.error("KV del error:", e);
      return 0;
    }
  }

  async lpush(key: string, value: string): Promise<number> {
    try {
      const res = await kv.lpush(key, value);
      return typeof res === 'number' ? res : 1;
    } catch (e) {
      console.error("KV lpush error:", e);
      return 0;
    }
  }

  async lrange(key: string, start: number, end: number): Promise<any[]> {
    try {
      const res = await kv.lrange(key, start, end);
      return res || [];
    } catch (e) {
      console.error("KV lrange error:", e);
      return [];
    }
  }

  async lpop(key: string): Promise<string | null> {
    try {
      const res = await kv.lpop(key);
      return (res as string) || null;
    } catch (e) {
      console.error("KV lpop error:", e);
      return null;
    }
  }

  async lrem(key: string, count: number, value: string): Promise<number> {
    try {
      const res = await kv.lrem(key, count, value);
      return typeof res === 'number' ? res : 1;
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