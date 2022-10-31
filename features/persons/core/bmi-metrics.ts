import stream from 'stream';
import { getBMIMetric } from '../../../shared/core/bmi';
import { PersonInput } from '../../../shared/models';

export class ConvertToBMIMetrics extends stream.Transform {
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
