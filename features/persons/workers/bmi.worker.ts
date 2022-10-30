import { Job } from 'bullmq';
import { createQueue, createWorker } from '../../../config/bull.config';
import { logger } from '../../../config/log.config';
import { connection } from '../../../config/redis.config';
import { handlePersonsBMIRequest } from '../core/person';

interface SplitterJob extends Record<string, string> {
  videoFile: string;
}

const bmiProcessor = async (job: Job<SplitterJob>): Promise<void> => {
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

const PERSON_BMI_QUEUE = 'bmi';
export const worker = createWorker<StreamInputData>(PERSON_BMI_QUEUE, bmiProcessor, connection);
export const queue = createQueue<StreamInputData>(PERSON_BMI_QUEUE);
export async function addJob(data: StreamInputData) {
  await queue.add(PERSON_BMI_QUEUE, data, { delay: 500 });
}
