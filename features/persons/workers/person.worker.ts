import { Job } from 'bullmq';
import { createQueue, createWorker } from '../../../config/bull.config';
import { logger } from '../../../config/log.config';
import { connection } from '../../../config/redis.config';
import { createSeedData } from '../seeds/person.seeds';

interface SeedInputData {
  noOfPersons: number;
  outputFile: string;
}
const seedProcessor = async (job: Job<SeedInputData>): Promise<void> => {
  try {
    const result = await createSeedData(job.data.outputFile, job.data.noOfPersons);
    logger.info('result', result);
  } catch (err) {
    logger.error('err', err);
  }
};

const PERSON_SEED_QUEUE = 'person';
export const seedWorker = createWorker<SeedInputData>(PERSON_SEED_QUEUE, seedProcessor, connection);
export const seedQueue = createQueue<SeedInputData>(PERSON_SEED_QUEUE);
export async function addSeedJob(data: SeedInputData) {
  await seedQueue.add(PERSON_SEED_QUEUE, data);
}
