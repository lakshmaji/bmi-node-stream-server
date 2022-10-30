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
import { seedQueue, seedWorker } from './features/persons/workers/person.worker';
import { queue, worker as splitterWorker } from './features/persons/workers/bmi.worker';
import { connection } from './config/redis.config';
import { logger } from './config/log.config';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// https://swagger.io/docs/specification/about/
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BMI API',
      version: '1.0.0',
      description: 'This is a REST API application made with Express and written in typescript.',
      license: {
        name: 'Licensed Under MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'Lakshmaji',
        url: 'https://github.com/lakshmaji',
      },
    },
    servers: [
      {
        url: 'http://localhost:3007',
        description: 'Local server',
      },
    ],
    tags: [
      {
        name: 'System',
        description: 'System API',
      },
      {
        name: 'BMI',
        description: 'BMI APIs for humans',
      },
      {
        name: 'Person',
        description: 'The Persons API',
      },
    ],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
  apis: [
    // './features/**/routes/**/routes*.js',
    // './features/**/routes/*.routes*.js',
    './features/**/routes/*.routes*.ts',
    './index.ts',
  ],
};

const openapiSpecification = swaggerJsdoc(swaggerOptions);

dotenv.config();

const app: Express = express();
app.use(express.json());

const port = process.env.PORT;
const routes: Array<RoutesConfig> = [];

routes.push(new PersonsRoutes(app));

/**
 * @swagger
 * /:
 *  get:
 *    summary: The default root path of the system.
 *    tags: [System]
 *    description: Returns a greeting text.
 *    responses:
 *      200:
 *        description: Greeting
 */
app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Welcome to BMI API');
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

// const { addQueue, removeQueue, setQueues, replaceQueues } =
createBullBoard({
  queues: [new BullMQAdapter(queue), new BullMQAdapter(seedQueue)],
  serverAdapter: serverAdapter,
});

/**
 * @swagger
 * /admin/queues:
 *  get:
 *    summary: Monitor jobs in queue.
 *    tags: [System]
 *    description: A UI dashboard (un-guarded) for viewing jobs in the queue.
 *    responses:
 *      302:
 *        description: Queue Monitoring Dashboard
 *        headers:
 *          Location:
 *            description: URI where the client can view jobs
 *            schema:
 *              type: string
 *              format: admin/queues
 */
app.use('/admin/queues', serverAdapter.getRouter() as RequestHandler);

const server = http.createServer(app);

async function onSignal() {
  logger.info('server is starting cleanup');
  return Promise.all([await splitterWorker.close(), await seedWorker.close(), await connection.quit()]);
}

function onShutdown(): Promise<boolean> {
  logger.info('cleanup finished, server is shutting down');
  return Promise.resolve(true);
}

/**
 * @swagger
 * /healthcheck:
 *  get:
 *    summary: Health status.
 *    tags: [System]
 *    description: Redis connection and server health.
 *    responses:
 *      200:
 *        description: A JSON object containing health status
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  description: ok
 *      503:
 *        description: A JSON object containing health status
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  description: error
 */
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
  logger.info(`🚀 listening at ${ai.address} ${ai.port}`);
});
