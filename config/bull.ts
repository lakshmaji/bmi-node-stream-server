import { Worker, Processor, ConnectionOptions, Queue } from "bullmq";

export const connection: ConnectionOptions = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port:+(process.env.REDIS_PORT || 6379)
}

const concurrency = +(process.env.CONCURRENT_WORKERS || 2)

const queue = new Queue('file transcoding', { connection });


export async function addJob(queueName: string, opts: any) {
    await queue.add("banana", opts)
}

export function createWorker(
  name: string,
  processor: Processor,
  connection: ConnectionOptions,
) {
  const worker = new Worker(name, processor, {
    connection,
    concurrency,
  });

  worker.on("completed", (job, err) => {
    console.log(`Completed job ${job.id} on queue ${name}`);
  });

  worker.on("failed", (job, err) => {
    console.log(`Faille job ${job.id} on queue ${name}`, err);
  });

  return { worker };
}