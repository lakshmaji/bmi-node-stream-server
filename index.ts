import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { handlePersonBMIRequest, handlePersonsBMIRequest } from "./core/person";
import { createSeedData } from "./seeds/person";
import { dummy } from "./core/dummy";
import { BMIPerson } from "./types/external";

dotenv.config();

const app: Express = express();
app.use(express.json())

const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to BMI API");
});

app.post("/persons/bulk/bmi", async (req: Request, res: Response) => {
  const inputFile = "samples/inputs/one.json"
  const outputFile = "samples/outputs/one.json"
  // TODO: take file path from user input (no direct file upload) (file upload is delegated to services like s3, or cloud storage etc)
  await handlePersonsBMIRequest(inputFile, outputFile);
  return res.send("OK");
});

app.get("/persons/bmi", async (req: Request, res: Response) => {
  const personInput: BMIPerson = {
    HeightCm: req.body.HeightCm,
    WeightKg: req.body.WeightKg,
    Gender: req.body.Gender,
  }
  await handlePersonBMIRequest(personInput);
  return res.send("OK");
});

// TODO: this can be removed
app.get("/seed", async (req: Request, res: Response) => {
  const outputFile = "samples/outputs/two.json"
  const NO_OF_PERSONS = 100
  // TODO: background run in
  await createSeedData(outputFile, NO_OF_PERSONS);
  res.send(`Find seeds at ${outputFile}.`);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
