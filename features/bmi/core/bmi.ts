import { BMIStat, BMIStats } from '../models/bmi.model';
import { RedisCache } from '../../../shared/redis.cache';
import { bmiChart } from '../../../config/bmi.config';
import { StatsBMIMetrics } from './stats';
import { openJSONInput } from '../../../utils/file';
import { logger } from '../../../config/log.config';
import { BMI_STATS_KEY } from '../constants';

export async function getBMIStats(): Promise<BMIStat[]> {
  const cache = new RedisCache(60000);
  const stats = await cache.get<BMIStats>(BMI_STATS_KEY, (): Promise<BMIStats> => {
    // refresh the cache
    const ranges: BMIStat[] = bmiChart.map((chart) => {
      return {
        range: chart.range,
        count: 0,
      };
    });
    const initialState: BMIStats = ranges.reduce((acc, range) => {
      return { ...acc, [range.range]: range };
    }, {});
    return Promise.resolve(initialState);
  });

  return Object.values(stats);
}

export const handleBMIStatsRequest = (inputFile: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const cache = new RedisCache(60000);
    cache
      .get<BMIStats>(BMI_STATS_KEY, (): Promise<BMIStats> => {
        // refresh the cache
        const ranges: BMIStat[] = bmiChart.map((chart) => {
          return {
            range: chart.range,
            count: 0,
          };
        });
        const initialState: BMIStats = ranges.reduce((acc, range) => {
          return { ...acc, [range.range]: range };
        }, {});
        return Promise.resolve(initialState);
      })
      .then((prevStats) => {
        const statsBMIMetrics = new StatsBMIMetrics(prevStats);

        openJSONInput(inputFile)
          .pipe(statsBMIMetrics)
          .on('error', (err: Error) => {
            logger.error(err);
            reject('Failed!');
          })
          .on('finish', () => {
            cache
              .set<BMIStats>(BMI_STATS_KEY, statsBMIMetrics.stats)
              .then(() => {
                resolve('Completed!');
              })
              .catch((err: Error) => {
                logger.error(err);
                reject('Failed!');
              });
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
};
