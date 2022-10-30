import { openJSONInput, writeJSONOutput } from '../../../utils/file';
import stream from 'stream';
import { getBMIAnalysis } from '../../../utils/bmi';
import { Person } from '../models/person.model';
import { PersonInput } from '../models/input.model';
import { BMIStat, BMIStats, PersonBMIMetric } from '../models/bmi.model';
import { logger } from '../../../config/log.config';
import { RedisCache } from '../../../shared/redis.cache';
import { bmiChart } from '../../../config/bmi.config';

const BMI_STATS_KEY = 'bmi-stats-cache-store';

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
  const metrics = getBMIMetric(personInput);
  return metrics;
};

class ConvertToBMIMetrics extends stream.Transform {
  constructor() {
    super({ objectMode: true });
  }

  _transform(chunk: PersonInput, encoding: string, callback: () => void) {
    const outputChunk = getBMIMetric(chunk);
    this.push(outputChunk);
    callback();
  }

  _flush(callback: () => void) {
    callback();
  }
}

class StatsBMIMetrics extends stream.Transform {
  private _prevStats: BMIStats;
  constructor(initObj: BMIStats) {
    super({ objectMode: true });
    this._prevStats = initObj;
  }

  _transform(chunk: PersonInput, encoding: string, callback: () => void) {
    logger.info('bello prevStats', this._prevStats);
    const metrics = getBMIMetric(chunk);
    console.info('bello metrics', metrics);

    if (metrics?.bmi_range) {
      this._prevStats[metrics.bmi_range] = Object.assign({}, this._prevStats[metrics.bmi_range], {
        count: this._prevStats[metrics.bmi_range].count + 1,
      });
    }

    console.info('bello afterStats', this._prevStats);
    callback();
  }

  _flush(callback: () => void) {
    callback();
  }

  get stats(): BMIStats {
    return this._prevStats;
  }
}

function getBMIMetric(inputRow: PersonInput): PersonBMIMetric | undefined {
  const person = new Person(inputRow.height_cm, inputRow.weight_kg, inputRow.gender);

  const stats = getBMIAnalysis(person.bmi);
  if (stats) {
    return {
      height_cm: person.height_cm,
      weight_kg: person.weight_kg,
      gender: person.gender,
      health_risk: stats.healthRisk,
      category: stats.category,
      bmi_range: stats.range,
    };
  }
  return undefined;
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
          // .pipe(writeJSONOutput(outputFile))
          // .pipe(report)
          .on('error', (err: Error) => {
            logger.error(err);
            reject('Failed!');
          })
          .on('finish', () => {
            console.log('statsBMIMetrics', statsBMIMetrics.stats);
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
