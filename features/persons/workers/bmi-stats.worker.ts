import { Job } from 'bullmq';
import { createQueue, createWorker } from '../../../config/bull.config';
import { logger } from '../../../config/log.config';
import { getConnection } from '../../../config/redis.config';
import { handleBMIStatsRequest } from '../core/person';

interface StreamInputData {
  inputFile: string;
}

const statsProcessor = async (job: Job<StreamInputData>): Promise<void> => {
  try {
    const result = await handleBMIStatsRequest(job.data.inputFile);
    logger.info('result', result);
  } catch (err) {
    logger.error('err', err);
  }
};

const BMI_STATS_QUEUE = 'bmi-stats';
export const bmiStatsWorker = createWorker<StreamInputData>(BMI_STATS_QUEUE, statsProcessor, getConnection());
export const bmiStatsQueue = createQueue<StreamInputData>(BMI_STATS_QUEUE);
export async function addBMIStatsJob(data: StreamInputData) {
  await bmiStatsQueue.add(BMI_STATS_QUEUE, data, {
    delay: 500,
    removeOnComplete: {
      age: 3600, // keep up to 1 hour
      count: 50, // keep up to 50 jobs
    },
  });
}
