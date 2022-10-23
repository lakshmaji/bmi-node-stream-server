import { RoutesConfig } from "../config/routes.config";
import express from "express";
import { addJob } from "../workers/person.worker";
import { asyncWrapper } from "../utils/wrapper.express";
import { BMIPerson } from "../types/external";
import { handlePersonBMIRequest } from "../core/person";
import { createSeedData } from "../seeds/person.seeds";

export class PersonsRoutes extends RoutesConfig {
  constructor(app: express.Application) {
    super(app, "PersonsRoutes");
  }

  public registerRoutes() {
    this.app
      .route("/persons/bulk/bmi")
      .post(asyncWrapper(this.processBMIInBulk));

    this.app.route("/persons/bmi").post(this.personBMI);

    this.app.route("/persons/seed").post(this.seedPersons);
    return this.app;
  }

  // take file path from user input (no direct file upload) (file upload is delegated to services like s3, or cloud storage etc)
  private processBMIInBulk = async (
    req: express.Request,
    res: express.Response
  ) => {
    //   console.log("bello incoming post request")
    const inputFile = "samples/inputs/one.json";
    const outputFile = "samples/outputs/one.json";
    await addJob({ inputFile, outputFile });
    res.status(200).send("OK");
  };

  private personBMI =  (req: express.Request<Record<string, never>, Record<string, never>, BMIPerson>, res: express.Response) => {
    const personInput: BMIPerson = {
      HeightCm: req.body.HeightCm,
      WeightKg: req.body.WeightKg,
      Gender: req.body.Gender,
    };
    handlePersonBMIRequest(personInput);
    return res.send("OK");
  };

  private seedPersons = (req: express.Request, res: express.Response) => {
      const outputFile = "samples/outputs/two.json"
  const NO_OF_PERSONS = 100
  // TODO: background run in
    createSeedData(outputFile, NO_OF_PERSONS);
  res.send(`Find seeds at ${outputFile}.`);
  };
}
