import express, { Express, RequestHandler } from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { createTerminus, TerminusOptions } from '@godaddy/terminus';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { AddressInfo } from 'node:net';
import { RoutesConfig } from './config/routes.config';
import { PersonsRoutes } from './features/persons/routes/persons.routes';
import { queue, worker as splitterWorker } from './features/persons/workers/person.worker';
import { connection } from './config/redis.config';

dotenv.config();

const app: Express = express();
app.use(express.json());

const port = process.env.PORT;
const routes: Array<RoutesConfig> = [];

routes.push(new PersonsRoutes(app));

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Welcome to BMI API');
});

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

// const { addQueue, removeQueue, setQueues, replaceQueues } =
createBullBoard({
  queues: [new BullMQAdapter(queue)],
  serverAdapter: serverAdapter,
});

app.use('/admin/queues', serverAdapter.getRouter() as RequestHandler);

const server = http.createServer(app);

async function onSignal() {
  console.log('server is starting cleanup');
  return Promise.all([await splitterWorker.close(), await connection.quit()]);
}

function onShutdown(): Promise<boolean> {
  console.log('cleanup finished, server is shutting down');
  return Promise.resolve(true);
}

function onHealthCheck(): Promise<void> {
  return connection.status === 'ready' ? Promise.resolve() : Promise.reject(new Error('not ready'));
}

const options: TerminusOptions = {
  signal: 'SIGINT',
  healthChecks: { '/healthcheck': onHealthCheck },
  onSignal,
  onShutdown,
};
createTerminus(server, options);

server.listen(port, () => {
  const ai: AddressInfo = server.address() as AddressInfo;
  console.log(`🚀 listening at ${ai.address} ${ai.port}`);
});
