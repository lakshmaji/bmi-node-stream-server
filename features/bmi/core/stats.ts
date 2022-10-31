import stream from 'stream';
import { getBMIMetric } from '../../../shared/core/bmi';
import { PersonInput } from '../../../shared/models';
import { BMIStats } from '../models/bmi.model';

export class StatsBMIMetrics extends stream.Transform {
  private _prevStats: BMIStats;
  constructor(initObj: BMIStats) {
    super({ objectMode: true });
    this._prevStats = initObj;
  }

  _transform(chunk: PersonInput, encoding: string, callback: () => void) {
    const metrics = getBMIMetric(chunk);

    if (metrics?.bmi_range) {
      this._prevStats[metrics.bmi_range] = Object.assign({}, this._prevStats[metrics.bmi_range], {
        count: this._prevStats[metrics.bmi_range].count + 1,
      });
    }

    callback();
  }

  _flush(callback: () => void) {
    callback();
  }

  get stats(): BMIStats {
    return this._prevStats;
  }
}
