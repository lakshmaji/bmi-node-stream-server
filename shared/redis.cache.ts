import { connection } from '../config/redis.config';
import IORedis from 'ioredis';

export class RedisCache {
  private readonly cache: IORedis;
  private ttl: number;

  constructor(ttl: number) {
    this.ttl = ttl;
    this.cache = connection;

    this.cache.on('connect', () => {
      console.log(`Redis connection established`);
    });

    this.cache.on('error', (error: Error) => {
      console.error(`Redis error, service degraded:`, error);
    });
  }

  async flush(): Promise<void> {
    await this.cache.flushall();
  }

  // `fetcher` argument which is meant to refresh the cache
  async get<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    if (this.cache.status !== 'ready') {
      return await fetcher();
    }

    const value = await this.cache.get(key);
    if (value) {
      return <T>JSON.parse(value);
    }

    const result = await fetcher();

    await this.cache.set(key, JSON.stringify(result), 'EX', this.ttl);
    return <T>result;
  }

  async del(key: string): Promise<void> {
    await this.cache.del(key);
  }
}
