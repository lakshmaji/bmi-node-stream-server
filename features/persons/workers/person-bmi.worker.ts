import { Job } from 'bullmq';
import { createWorkerQueue } from '../../../config/bull.config';
import { logger } from '../../../config/log.config';
import { PERSON_BMI_QUEUE } from '../constants';
import { handlePersonsBMIRequest } from '../core/person';

interface PersonsInput {
  inputFile: string;
  outputFile: string;
}

const processPersonsBMI = async (job: Job<PersonsInput>): Promise<void> => {
  try {
    const result = await handlePersonsBMIRequest(job.data.inputFile, job.data.outputFile);
    logger.info('result', result);
  } catch (err) {
    logger.error('err', err);
  }
};

const { worker, queue, addJob } = createWorkerQueue<PersonsInput>(PERSON_BMI_QUEUE, processPersonsBMI);

export { worker as personsBMIWorker, queue as personsBMIQueue, addJob as addPersonsBMIJob };
