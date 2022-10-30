import { Worker, Processor, ConnectionOptions, Queue, Job } from 'bullmq';
import { logger } from './log.config';
import { connection } from './redis.config';

const concurrency = +(process.env.CONCURRENT_WORKERS || 1);

export const createQueue = <T>(name: string) => new Queue<T>(name, { connection });

export function createWorker<T>(name: string, processor: Processor, connection: ConnectionOptions) {
  const worker = new Worker(name, processor, {
    connection,
    concurrency,
  });

  worker.on('completed', (job: Job<T>, err: Error) => {
    if (err) {
      logger.error('err', err);
      return;
    }
    if (job.id) {
      logger.info(`Completed job ${job.id} on queue ${name}`);
    }
  });

  worker.on('failed', (job: Job<T>, err: Error) => {
    if (job.id) {
      logger.error(`Failed job ${job.id} on queue ${name}`, err);
    }
  });

  return worker;
}
