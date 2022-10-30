import { Job } from 'bullmq';
import { createQueue, createWorker } from '../../../config/bull.config';
import { logger } from '../../../config/log.config';
import { connection } from '../../../config/redis.config';
import { handlePersonsBMIRequest } from '../core/person';
import { createSeedData } from '../seeds/person.seeds';

// BMI
export interface SplitterJob extends Record<string, string> {
  videoFile: string;
}

const bananaProcessor = async (job: Job<SplitterJob>): Promise<void> => {
  try {
    const result = await handlePersonsBMIRequest(job.data.inputFile, job.data.outputFile);
    logger.info('result', result);
  } catch (err) {
    logger.error('err', err);
  }
};

interface StreamInputData {
  inputFile: string;
  outputFile: string;
}

const PERSON_BMI_QUEUE = 'banana';
export const worker = createWorker<StreamInputData>(PERSON_BMI_QUEUE, bananaProcessor, connection);
export const queue = createQueue<StreamInputData>(PERSON_BMI_QUEUE);
export async function addJob(data: StreamInputData) {
  await queue.add(PERSON_BMI_QUEUE, data, { delay: 500 });
}

// SEED
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

const PERSON_SEED_QUEUE = 'person-seeds';
export const seedWorker = createWorker<SeedInputData>(PERSON_SEED_QUEUE, seedProcessor, connection);
export const seedQueue = createQueue<SeedInputData>(PERSON_SEED_QUEUE);
export async function addSeedJob(data: SeedInputData) {
  await seedQueue.add(PERSON_SEED_QUEUE, data);
}
