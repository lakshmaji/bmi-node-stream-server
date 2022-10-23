import { openJSONInput, writeJSONOutput } from '../../../utils/file';
import stream, { TransformCallback } from 'stream';
import { getBMIAnalysis } from '../../../utils/bmi';
import { Person } from '../models/person.model';
import { PersonInput } from '../models/input.model';
import { PersonBMIMetric } from '../models/bmi.model';

export const handlePersonsBMIRequest = (inputFile: string, outputFile: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    openJSONInput(inputFile)
      .pipe(appendBMIMetrics())
      .pipe(writeJSONOutput(outputFile))
      .on('error', (err: Error) => {
        console.log(err);
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

function appendBMIMetrics() {
  const transformStream = new stream.Transform({ objectMode: true });
  transformStream._transform = (inputChunk: PersonInput, encoding: BufferEncoding, callback: TransformCallback) => {
    const outputChunk = getBMIMetric(inputChunk);
    transformStream.push(outputChunk);
    callback();
  };
  return transformStream;
}

function getBMIMetric(inputRow: PersonInput): PersonBMIMetric | undefined {
  const person = new Person(inputRow.HeightCm, inputRow.WeightKg, inputRow.Gender);

  const stats = getBMIAnalysis(person.bmi);
  if (stats) {
    return {
      height: person.height,
      weight: person.weight,
      gender: person.gender,
      health_risk: stats.healthRisk,
      category: stats.category,
      bmi_range: stats.range,
    };
  }
  return undefined;
}
