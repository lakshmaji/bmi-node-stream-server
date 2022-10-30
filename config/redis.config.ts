import { ConnectionOptions } from 'bullmq';
import Redis from 'ioredis';

const redisConfig: ConnectionOptions = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: +(process.env.REDIS_PORT || 6379),
};

export const connection = new Redis({
  port: redisConfig.port,
  host: redisConfig.host,
  maxRetriesPerRequest: null,
});
