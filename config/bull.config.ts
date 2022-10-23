import { Worker, Processor, ConnectionOptions, Queue, Job } from "bullmq";
import IORedis from 'ioredis';

const redisConfig: ConnectionOptions = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port:+(process.env.REDIS_PORT || 6379)
}

export const connection = new IORedis({
  port: redisConfig.port, 
  host: redisConfig.host
});


const concurrency = +(process.env.CONCURRENT_WORKERS || 1)

export const createQueue = <T>(name: string) => new Queue<T>(name, { connection });

export function createWorker<T>(
  name: string,
  processor: Processor,
  connection: ConnectionOptions,
) {
  const worker = new Worker(name, processor, {
    connection,
    concurrency,
  });

  worker.on("completed", (job: Job<T>, err: Error) => {
    if(err) {
      console.log("err", err)
      return
    }
    if(job.id) {
      console.log(`Completed job ${job.id} on queue ${name}`);
    }
  });

  worker.on("failed", (job: Job<T>, err: Error) => {
    if (job.id) {
      console.log(`Failed job ${job.id} on queue ${name}`, err);
    }
  });

  return  worker ;
}