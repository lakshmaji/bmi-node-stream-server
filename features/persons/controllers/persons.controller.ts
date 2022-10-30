import express from 'express';
import { uniqueId } from '../../../utils/id';
import { handlePersonBMIRequest } from '../core/person';
import { PersonInput } from '../models/input.model';
import { addBMIStatsJob } from '../workers/bmi-stats.worker';
import { addJob } from '../workers/bmi.worker';
import { addSeedJob } from '../workers/person.worker';

class PersonsController {
  // take file path from user input (no direct file upload) (file upload is delegated to services like s3, or cloud storage etc)
  public processBMIInBulk = async (
    req: express.Request<Record<string, string>, Record<string, never>, { filepath: string }>,
    res: express.Response,
  ) => {
    const inputFile = req.body.filepath;

    const key = uniqueId();
    const outputFile = `storage/processed/${key}.json`;
    await addJob({ inputFile, outputFile });
    await addBMIStatsJob({ inputFile });
    res.status(200).json({
      key,
    });
  };

  public personBMI = (
    req: express.Request<Record<string, never>, Record<string, never>, PersonInput>,
    res: express.Response,
  ) => {
    const personInput: PersonInput = {
      height_cm: req.body.height_cm,
      weight_kg: req.body.weight_kg,
      gender: req.body.gender,
    };
    const metrics = handlePersonBMIRequest(personInput);
    return res.status(200).json(metrics);
  };

  public seedPersons = async (
    req: express.Request<Record<string, string>, Record<string, never>, { filename: string; no_of_persons: number }>,
    res: express.Response,
  ) => {
    const outputFile = `storage/uploads/${req.body.filename}.json`;
    const NO_OF_PERSONS = 100;
    await addSeedJob({ outputFile, noOfPersons: req.body.no_of_persons || NO_OF_PERSONS });
    res.status(200).json({ message: `Find seeds at ${outputFile}.` });
  };

  public downloadBMIInBulk = (req: express.Request<{ key: string }, Record<string, never>>, res: express.Response) => {
    const key = req.params.key;
    const filePath = `storage/processed/${key}.json`;

    try {
      res.download(filePath);
    } catch (err) {
      res.sendStatus(500);
    }
  };
}
export default new PersonsController();
