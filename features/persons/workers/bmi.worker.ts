import { Job } from 'bullmq';
import { createQueue, createWorker } from '../../../config/bull.config';
import { logger } from '../../../config/log.config';
import { getConnection } from '../../../config/redis.config';
import { handlePersonsBMIRequest } from '../core/person';

interface StreamInputData {
  inputFile: string;
  outputFile: string;
}

const bmiProcessor = async (job: Job<StreamInputData>): Promise<void> => {
  try {
    const result = await handlePersonsBMIRequest(job.data.inputFile, job.data.outputFile);
    logger.info('result', result);
  } catch (err) {
    logger.error('err', err);
  }
};

const PERSON_BMI_QUEUE = 'bmi';
export const worker = createWorker<StreamInputData>(PERSON_BMI_QUEUE, bmiProcessor, getConnection());
export const queue = createQueue<StreamInputData>(PERSON_BMI_QUEUE);
export async function addJob(data: StreamInputData) {
  await queue.add(PERSON_BMI_QUEUE, data, {
    // delay: 500,
    // removeOnComplete: {
    //   age: 3600, // keep up to 1 hour
    //   count: 50, // keep up to 50 jobs
    // },
  });
}
