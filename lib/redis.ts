class MockDatabase {
  private hashes: Record<string, Record<string, string>> = {
    'player:Senira': { wins: '5', nickname: 'The Mastermind', avatar: '🎩', country: '🇱🇰 Sri Lanka' }
  };
  private lists: Record<string, string[]> = {
    'history:Senira': [new Date().toISOString()]
  };
  private comments: string[] = [];

  async keys(pattern: string) {
    if (pattern === 'player:*') return Object.keys(this.hashes);
    return [];
  }

  async hgetall(key: string) {
    return this.hashes[key] || null;
  }

  async hset(key: string, value: Record<string, any>) {
    if (!this.hashes[key]) this.hashes[key] = {};
    for (const [k, v] of Object.entries(value)) {
      this.hashes[key][k] = String(v);
    }
    return 1;
  }

  async hincrby(key: string, field: string, increment: number) {
    if (!this.hashes[key]) this.hashes[key] = {};
    const current = parseInt(this.hashes[key][field] || '0');
    const next = current + increment;
    this.hashes[key][field] = String(next);
    return next;
  }

  async exists(key: string) {
    return this.hashes[key] ? 1 : 0;
  }

  async lpush(key: string, value: string) {
    if (key === 'monopoly_comments') {
      this.comments.unshift(value);
      return this.comments.length;
    }
    if (!this.lists[key]) this.lists[key] = [];
    this.lists[key].unshift(value);
    return this.lists[key].length;
  }

  async lrange(key: string, start: number, end: number) {
    if (key === 'monopoly_comments') {
      return end === -1 ? this.comments : this.comments.slice(start, end + 1);
    }
    if (!this.lists[key]) return [];
    return end === -1 ? this.lists[key] : this.lists[key].slice(start, end + 1);
  }

  async lrem(key: string, count: number, value: string) {
    if (key === 'monopoly_comments') {
      this.comments = this.comments.filter(v => v !== value);
      return 1;
    }
    if (!this.lists[key]) return 0;
    this.lists[key] = this.lists[key].filter(v => v !== value);
    return 1;
  }

  async lpop(key: string) {
    if (!this.lists[key] || this.lists[key].length === 0) return null;
    return this.lists[key].shift();
  }

  // REAL DELETE - FIXES THE BUG
  async del(key: string) {
    delete this.hashes[key];
    const historyKey = key.replace('player:', 'history:');
    delete this.lists[historyKey];
    return 1;
  }
}

const globalForRedis = global as unknown as { mockRedis: MockDatabase };
const redis = globalForRedis.mockRedis || new MockDatabase();
if (process.env.NODE_ENV !== 'production') globalForRedis.mockRedis = redis;

export default redis;