import { BMIStat, BMIStats } from '../models/bmi.model';
import { RedisCache } from '../../../shared/redis.cache';
import { bmiChart } from '../../../config/bmi.config';

const BMI_STATS_KEY = 'bmi-stats-cache-store';

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
