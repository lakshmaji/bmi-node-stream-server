import { getConnection } from '../config/redis.config';
import IORedis from 'ioredis';
import { logger } from '../config/log.config';

export class RedisCache {
  private readonly cache: IORedis;
  // in seconds
  private ttl: number;

  constructor(ttl: number) {
    this.ttl = ttl;
    this.cache = getConnection();

    this.cache.on('connect', () => {
      logger.info(`Redis connection established`);
    });

    this.cache.on('error', (error: Error) => {
      logger.error(`Redis error, service degraded:`, error);
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

    await this.set<T>(key, result);
    return <T>result;
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.cache.set(key, JSON.stringify(value), 'EX', this.ttl);
  }

  async del(key: string): Promise<void> {
    await this.cache.del(key);
  }
}
