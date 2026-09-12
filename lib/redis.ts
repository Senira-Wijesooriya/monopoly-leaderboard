class RedisClient {
  private url = process.env.UPSTASH_REDIS_REST_URL || '';
  private token = process.env.UPSTASH_REDIS_REST_TOKEN || '';
  
  // Start completely empty so deleted users never magically come back
  private memoryHash: Record<string, Record<string, string>> = {};
  private memoryList: Record<string, string[]> = {
    'monopoly_comments': []
  };

  private async request(command: any[]) {
    if (!this.url || !this.token) return null;
    try {
      const res = await fetch(this.url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(command),
      });
      const data = await res.json();
      return data.result;
    } catch (e) {
      return null;
    }
  }

  async keys(pattern: string) {
    const res = await this.request(['KEYS', pattern]);
    if (res) return res;
    return Object.keys(this.memoryHash);
  }

  async hgetall(key: string) {
    const res = await this.request(['HGETALL', key]);
    if (res && Array.isArray(res)) {
      const obj: Record<string, string> = {};
      for (let i = 0; i < res.length; i += 2) obj[res[i]] = res[i + 1];
      return obj;
    }
    return this.memoryHash[key] || {};
  }

  async hset(key: string, value: Record<string, any>) {
    const remoteRes = await this.request(['HSET', key, ...Object.entries(value).flat()]);
    if (remoteRes !== null) return remoteRes;

    if (!this.memoryHash[key]) this.memoryHash[key] = {};
    for (const [k, v] of Object.entries(value)) {
      this.memoryHash[key][k] = String(v);
    }
    return 1;
  }

  async hincrby(key: string, field: string, increment: number) {
    const remoteRes = await this.request(['HINCRBY', key, field, increment]);
    if (remoteRes !== null) return remoteRes;

    if (!this.memoryHash[key]) this.memoryHash[key] = {};
    const cur = parseInt(this.memoryHash[key][field] || '0');
    const next = cur + increment;
    this.memoryHash[key][field] = String(next);
    return next;
  }

  async exists(key: string): Promise<number> {
    const remoteRes = await this.request(['EXISTS', key]);
    if (remoteRes !== null) return remoteRes;
    return this.memoryHash[key] ? 1 : 0;
  }

  async del(key: string) {
    await this.request(['DEL', key]);
    delete this.memoryHash[key];
    delete this.memoryList[key.replace('player:', 'history:')];
    return 1;
  }

  async lpush(key: string, value: string) {
    const remoteRes = await this.request(['LPUSH', key, value]);
    if (remoteRes !== null) return remoteRes;

    if (!this.memoryList[key]) this.memoryList[key] = [];
    this.memoryList[key].unshift(value);
    return this.memoryList[key].length;
  }

  async lrange(key: string, start: number, end: number) {
    const remoteRes = await this.request(['LRANGE', key, start, end]);
    if (remoteRes) return remoteRes;

    const list = this.memoryList[key] || [];
    return end === -1 ? list : list.slice(start, end + 1);
  }

  async lpop(key: string) {
    const remoteRes = await this.request(['LPOP', key]);
    if (remoteRes !== null) return remoteRes;

    const list = this.memoryList[key] || [];
    return list.shift() || null;
  }

  async lrem(key: string, count: number, value: string) {
    const remoteRes = await this.request(['LREM', key, count, value]);
    if (remoteRes !== null) return remoteRes;

    const list = this.memoryList[key] || [];
    this.memoryList[key] = list.filter((item: string) => item !== value);
    return 1;
  }
}

const globalForRedis = global as unknown as { redisClient: RedisClient };
const redis = globalForRedis.redisClient || new RedisClient();
if (process.env.NODE_ENV !== 'production') globalForRedis.redisClient = redis;

export default redis;