import dotenv from 'dotenv';
import http from 'http';
import { createTerminus, TerminusOptions } from '@godaddy/terminus';
import { AddressInfo } from 'node:net';
import { logger } from './config/log.config';
import app, { healthCheck, shutdown, teardown } from './app';

dotenv.config();
const port = process.env.PORT;

const options: TerminusOptions = {
  signal: 'SIGINT',
  healthChecks: { '/healthcheck': healthCheck },
  onSignal: teardown,
  onShutdown: shutdown,
};

const server = http.createServer(app);

createTerminus(server, options);

server.listen(port, () => {
  const ai: AddressInfo = server.address() as AddressInfo;
  logger.info(`🚀 listening at ${ai.address} ${ai.port}`);
});
