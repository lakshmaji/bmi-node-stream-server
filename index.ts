import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { handlePersonBMIRequest, handlePersonsBMIRequest } from "./core/person";
import { createSeedData } from "./seeds/person";
import { dummy } from "./core/dummy";
import { BMIPerson } from "./types/external";
import { addJob, connection, createWorker, queue } from "./config/bull";
import { Job } from 'bullmq'
import http from 'http'
import { createTerminus }  from '@godaddy/terminus';

dotenv.config();

const app: Express = express();
app.use(express.json())

const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to BMI API");
});

export interface SplitterJob extends Record<string, string> {
  videoFile: string;
}


const bananaProcessor = async (job: Job<SplitterJob>): Promise<any> => {
  console.log("inside bananaProcessor", job)
}

const { worker: splitterWorker } = createWorker(
  "banana",
  bananaProcessor,
  connection,
);

app.post("/persons/bulk/bmi", async (req: Request, res: Response) => {
  const inputFile = "samples/inputs/one.json"
  const outputFile = "samples/outputs/one.json"
  await addJob("banana", { inputFile, outputFile })
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

// const server = app.listen(port, () => {
//   console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
// });

// process.on('SIGTERM', async () => {
//   console.log('SIGTERM signal received: closing HTTP server')
//   await splitterWorker.close();

//   server.close(() => {
//     console.log('HTTP server closed')
//   })
// })

const server = http.createServer(app)

async function onSignal () {
  console.log('server is starting cleanup');
  return Promise.all([
      await splitterWorker.close(),
    // your clean logic, like closing database connections
  ]);
}

async function onShutdown (): Promise<any> {
  console.log('cleanup finished, server is shutting down');
}

function onHealthCheck ({  }) :Promise<any> {
  // `state.isShuttingDown` (boolean) shows whether the server is shutting down or not
  // return Promise.resolve(
    // optionally include a resolve value to be included as
    // info in the health check response
  // )
  return Promise.resolve(true);
}

const options =  {
  signal: 'SIGINT',
  healthChecks: { '/healthcheck': onHealthCheck,  },
  onSignal,
  onShutdown,
}
createTerminus(server, options)

server.listen(port)
