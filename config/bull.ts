import { Worker, Processor, ConnectionOptions, Queue } from "bullmq";

export const PERSON_BMI_QUEUE = "banana"
export const connection: ConnectionOptions = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port:+(process.env.REDIS_PORT || 6379)
}

const concurrency = +(process.env.CONCURRENT_WORKERS || 1)

export const queue = new Queue(PERSON_BMI_QUEUE, { connection });


export async function addJob(queueName: string, data: any) {
    await queue.add(queueName, data, { delay: 500 })
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