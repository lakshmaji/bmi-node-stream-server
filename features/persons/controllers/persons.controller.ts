import express from 'express';
import { handlePersonBMIRequest } from '../core/person';
import { PersonInput } from '../models/input.model';
import { createSeedData } from '../seeds/person.seeds';
import { addJob } from '../workers/person.worker';

class PersonsController {
  // take file path from user input (no direct file upload) (file upload is delegated to services like s3, or cloud storage etc)
  public processBMIInBulk = async (req: express.Request, res: express.Response) => {
    const inputFile = 'samples/inputs/one.json';
    const outputFile = 'samples/outputs/one.json';
    await addJob({ inputFile, outputFile });
    res.status(200).send('OK');
  };

  public personBMI = (
    req: express.Request<Record<string, never>, Record<string, never>, PersonInput>,
    res: express.Response,
  ) => {
    const personInput: PersonInput = {
      HeightCm: req.body.HeightCm,
      WeightKg: req.body.WeightKg,
      Gender: req.body.Gender,
    };
    const metrics = handlePersonBMIRequest(personInput);
    return res.status(200).json(metrics);
  };

  public seedPersons = (req: express.Request, res: express.Response) => {
    const outputFile = 'samples/outputs/two.json';
    const NO_OF_PERSONS = 100;
    // TODO: background run in
    createSeedData(outputFile, NO_OF_PERSONS);
    res.send(`Find seeds at ${outputFile}.`);
  };
}
export default new PersonsController();
