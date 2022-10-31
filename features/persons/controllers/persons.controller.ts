import express from 'express';
import { uniqueId } from '../../../utils/id';
import { handlePersonBMIRequest } from '../core/person';
import { addBMIStatsJob } from '../../bmi/workers/bmi-stats.worker';
import { addPersonsBMIJob } from '../workers/person-bmi.worker';
import { addSeedPersonsJob } from '../workers/person-seed.worker';
import { PersonInput } from '../../../shared/models';
import { NO_OF_PERSONS } from '../constants';
import { JSONFileInputPath, JSONFileOutputPath } from '../utils';

class PersonsController {
  // take file path from user input (no direct file upload) (file upload is delegated to services like s3, or cloud storage etc)
  public processBMIInBulk = async (
    req: express.Request<Record<string, string>, Record<string, never>, { filepath: string }>,
    res: express.Response,
  ) => {
    const inputFile = req.body.filepath;
    const key = uniqueId();
    await addPersonsBMIJob({ inputFile, outputFile: JSONFileOutputPath(key) });
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
    const outputFile = JSONFileInputPath(req.body.filename);
    await addSeedPersonsJob({ outputFile, noOfPersons: req.body.no_of_persons || NO_OF_PERSONS });
    res.status(200).json({ message: `Find seeds at ${outputFile}.` });
  };

  public downloadBMIReport = (req: express.Request<{ key: string }, Record<string, never>>, res: express.Response) => {
    const filepath = JSONFileOutputPath(req.params.key);
    try {
      res.download(filepath);
    } catch (err) {
      res.sendStatus(500);
    }
  };
}
export default new PersonsController();
