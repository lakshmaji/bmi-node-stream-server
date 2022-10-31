import { openJSONInput, writeJSONOutput } from '../../../utils/file';
import { PersonBMIMetric, PersonInput } from '../../../shared/models';
import { logger } from '../../../config/log.config';
import { getBMIMetric } from '../../../shared/core/bmi';
import { ConvertToBMIMetrics } from './bmi-metrics';

export const handlePersonsBMIRequest = (inputFile: string, outputFile: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const transformBMIMetrics = new ConvertToBMIMetrics();
    openJSONInput(inputFile)
      .pipe(transformBMIMetrics)
      .pipe(writeJSONOutput(outputFile))
      .on('error', (err: Error) => {
        logger.error(err);
        reject('Failed!');
      })
      .on('finish', () => {
        resolve('Completed!');
      });
  });
};

export const handlePersonBMIRequest = (personInput: PersonInput): PersonBMIMetric | undefined => {
  return getBMIMetric(personInput);
};
