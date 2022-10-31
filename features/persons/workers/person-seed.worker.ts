import { Job } from 'bullmq';
import { createWorkerQueue } from '../../../config/bull.config';
import { logger } from '../../../config/log.config';
import { PERSON_SEED_QUEUE } from '../constants';
import { createSeedData } from '../seeds/person.seeds';

interface SeedPersonInput {
  noOfPersons: number;
  outputFile: string;
}

const seedPersons = async (job: Job<SeedPersonInput>): Promise<void> => {
  try {
    const result = await createSeedData(job.data.outputFile, job.data.noOfPersons);
    logger.info('result', result);
  } catch (err) {
    logger.error('err', err);
  }
};

const { worker, queue, addJob } = createWorkerQueue<SeedPersonInput>(PERSON_SEED_QUEUE, seedPersons);

export { worker as seedPersonWorker, queue as seedPersonQueue, addJob as addSeedPersonsJob };
