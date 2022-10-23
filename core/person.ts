import { Gender, PersonBMIMetric } from "../types";
import { openJSONInput, writeJSONOutput } from "../utils/file";
import stream, { TransformCallback } from "stream";
import { computeBMI, getBMIAnalysis } from "../utils/bmi";
import { BMIPerson } from "../types/external";

const genderMap: Record<"male" | "female", Gender> = {
  male: Gender.Male,
  female: Gender.Female,
};

export class Person {
  private _height: number;
  private _weight: number;
  private _gender: Gender;

  constructor(height: string, weight: string, gender: "male" | "female") {
    this._height = +height;
    this._weight = +weight;
    this._gender = genderMap[gender];
  }

  get length(): number {
    return Object.getOwnPropertyNames(this).length;
  }

  get height(): number {
    return this._height;
  }

  get weight(): number {
    return this._weight;
  }

  get gender(): Gender {
    return this._gender;
  }

  get bmi(): number {
    return computeBMI(this._height, this._weight);
  }
}

export const handlePersonsBMIRequest = (
  inputFile: string,
  outputFile: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    openJSONInput(inputFile)
      .pipe(appendBMIMetrics())
      .pipe(writeJSONOutput(outputFile))
      .on("error", (err: Error) => {
        console.log(err);
        reject("Failed!");
      })
      .on("finish", () => {
        resolve("Completed!");
      });
  });
};

export const handlePersonBMIRequest =  (
    personInput: BMIPerson
  ): PersonBMIMetric | undefined => {
    const metrics = processBMIMetric(personInput)
    return metrics
  };

function appendBMIMetrics() {
  const transformStream = new stream.Transform({ objectMode: true });
  transformStream._transform = (inputChunk: BMIPerson, encoding: BufferEncoding, callback: TransformCallback) => {
    const outputChunk = processBMIMetric(inputChunk);
    transformStream.push(outputChunk);
    callback();
  };
  return transformStream;
}

function processBMIMetric(inputRow: BMIPerson): PersonBMIMetric | undefined {
  const person = new Person(
    inputRow.HeightCm,
    inputRow.WeightKg,
    inputRow.Gender
  );

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
