import { Job } from 'bullmq';
import { createWorkerQueue } from '../../../config/bull.config';
import { logger } from '../../../config/log.config';
import { BMI_STATS_QUEUE } from '../constants';
import { handleBMIStatsRequest } from '../core/bmi';

interface BMIStatsInput {
  inputFile: string;
}

const analyzeBMIStats = async (job: Job<BMIStatsInput>): Promise<void> => {
  try {
    const result = await handleBMIStatsRequest(job.data.inputFile);
    logger.info('result', result);
  } catch (err) {
    logger.error('err', err);
  }
};

const { worker, queue, addJob } = createWorkerQueue<BMIStatsInput>(BMI_STATS_QUEUE, analyzeBMIStats);

export { worker as bmiStatsWorker, queue as bmiStatsQueue, addJob as addBMIStatsJob };
