import express, { Express, RequestHandler } from "express";
import dotenv from "dotenv";
import { connection } from "./config/bull.config";
import http from 'http'
import { createTerminus, TerminusOptions }  from '@godaddy/terminus';
// import Redis from 'ioredis'
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { AddressInfo } from "node:net";
import { RoutesConfig } from "./config/routes.config";
import { PersonsRoutes } from "./routes/persons.routes";
import {queue, worker as splitterWorker} from './workers/person.worker'

dotenv.config();

const app: Express = express();
app.use(express.json())

const port = process.env.PORT;
const routes: Array<RoutesConfig> = [];

routes.push(new PersonsRoutes(app));

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Welcome to BMI API");
});


// take file path from user input (no direct file upload) (file upload is delegated to services like s3, or cloud storage etc)
// app.post("/persons/bulk/bmi", async (req: express.Request, res: express.Response) => {
//   console.log("bello incoming post request")
//   const inputFile = "samples/inputs/one.json"
//   const outputFile = "samples/outputs/one.json"
//   await addJob(PERSON_BMI_QUEUE, { inputFile, outputFile })
  
//   return res.status(200).send("OK");
// });

// app.get("/persons/bmi", async (req: express.Request, res: express.Response) => {
//   const personInput: BMIPerson = {
//     HeightCm: req.body.HeightCm,
//     WeightKg: req.body.WeightKg,
//     Gender: req.body.Gender,
//   }
//   await handlePersonBMIRequest(personInput);
//   return res.send("OK");
// });

// // TODO: this can be removed
// app.get("/seed", async (req: express.Request, res: express.Response) => {
//   const outputFile = "samples/outputs/two.json"
//   const NO_OF_PERSONS = 100
//   // TODO: background run in
//   await createSeedData(outputFile, NO_OF_PERSONS);
//   res.send(`Find seeds at ${outputFile}.`);
// });




const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

// const { addQueue, removeQueue, setQueues, replaceQueues } = 
createBullBoard({
  queues: [new BullMQAdapter(queue)],
  serverAdapter: serverAdapter,
});

app.use('/admin/queues', serverAdapter.getRouter() as RequestHandler);


const server = http.createServer(app)

async function onSignal () {
  console.log('server is starting cleanup');
  return Promise.all([
      await splitterWorker.close(),
  ]);
}

 function onShutdown (): Promise<boolean> {
  console.log('cleanup finished, server is shutting down');
  return Promise.resolve(true)
}

function onHealthCheck () :Promise<boolean> {
  // `state.isShuttingDown` (boolean) shows whether the server is shutting down or not
  console.log('redis status useful for adding health checks', connection.status)
  // return Promise.resolve(
    // optionally include a resolve value to be included as
    // info in the health check response
  // )
  return Promise.resolve(true);
}

const options: TerminusOptions =  {
  signal: 'SIGINT',
  healthChecks: { '/healthcheck': onHealthCheck,  },
  onSignal,
  onShutdown,
}
createTerminus(server, options)

server.listen(port, ()=>{
  const ai :AddressInfo = server.address() as AddressInfo
    console.log(`🚀 listening at ${ai.address} ${ai.port}`)
})
