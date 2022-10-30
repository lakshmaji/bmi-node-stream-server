import { Worker, Processor, ConnectionOptions, Queue, Job } from 'bullmq';
import { logger } from './log.config';
import { getConnection } from './redis.config';

const concurrency = +(process.env.CONCURRENT_WORKERS || 1);

export const createQueue = <T>(name: string) =>
  new Queue<T>(name, {
    connection: getConnection(),
    // defaultJobOptions: {
    //   removeOnComplete: {
    //     age: 3600, // keep up to 1 hour
    //     count: 50, // keep up to 50 jobs
    //   },
    // },
  });

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
      job
        .updateProgress(100)
        .then(() => {
          logger.info('update progress');
        })
        .catch((err) => {
          logger.error('err', err);
        });
    }
  });

  worker.on('failed', (job: Job<T>, err: Error) => {
    if (job.id) {
      logger.error(`Failed job ${job.id} on queue ${name}`, err);
    }
  });

  return worker;
}
