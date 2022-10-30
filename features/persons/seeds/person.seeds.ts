import { faker } from '@faker-js/faker';
import { Stream } from 'stream';
import { logger } from '../../../config/log.config';
import { noop } from '../../../types';
import { writeJSONOutput } from '../../../utils/file';
import { Gender } from '../models/constants';
import { PersonModel } from '../models/person.model';

export function createPerson(): PersonModel {
  const person = {
    height: faker.datatype.number({ min: 130, max: 190, precision: 0.01 }),
    weight: faker.datatype.number({ min: 50, max: 130, precision: 0.01 }),
    gender: faker.name.gender() as Gender,
  };
  Object.defineProperty(person, 'length', {
    value: Object.keys(person).length,
  });
  return person;
}

export const createSeedData = async (filePath: string, noOfPersons: number): Promise<void> => {
  const readable = new Stream.Readable({ objectMode: true });
  readable._read = noop;

  Array.from({ length: noOfPersons }).forEach(() => {
    readable.push(createPerson());
  });

  readable.push(null);
  return new Promise((resolve, reject) => {
    readable
      .pipe(writeJSONOutput(filePath))
      .on('error', (err: Error) => {
        logger.error(err);
        reject('Failed!');
      })
      .on('finish', () => {
        resolve();
      });
  });
};
