import express, { Express, RequestHandler } from 'express';
import dotenv from 'dotenv';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { RoutesConfig } from './config/routes.config';
import { PersonsRoutes } from './features/persons/routes/persons.routes';
import { seedPersonQueue, seedPersonWorker } from './features/persons/workers/person-seed.worker';
import { bmiStatsQueue, bmiStatsWorker } from './features/bmi/workers/bmi-stats.worker';
import { personsBMIQueue, personsBMIWorker } from './features/persons/workers/person-bmi.worker';
import { getConnection } from './config/redis.config';
import { logger } from './config/log.config';
import swaggerUi from 'swagger-ui-express';
import { BMIRoutes } from './features/bmi/routes/bmi.routes';
import { openAPISpecification } from './config/swagger.config';

dotenv.config();

const app: Express = express();
/**
 * Middleware's here
 */
app.use(express.json());

/**
 * register routes here
 */
const routes: Array<RoutesConfig> = [];
routes.push(new PersonsRoutes(app));
routes.push(new BMIRoutes(app));

/**
 * Background runner config
 */
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [new BullMQAdapter(personsBMIQueue), new BullMQAdapter(seedPersonQueue), new BullMQAdapter(bmiStatsQueue)],
  serverAdapter: serverAdapter,
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openAPISpecification));

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
export function healthCheck(): Promise<void> {
  return getConnection().status === 'ready' ? Promise.resolve() : Promise.reject(new Error('not ready'));
}

export async function teardown() {
  logger.info('server is starting cleanup');
  return Promise.all([
    await personsBMIWorker.close(),
    await seedPersonWorker.close(),
    await bmiStatsWorker.close(),
    await getConnection().quit(),
  ]);
}

export function shutdown(): Promise<boolean> {
  logger.info('cleanup finished, server is shutting down');
  return Promise.resolve(true);
}

export default app;
