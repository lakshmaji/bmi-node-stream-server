import winston, { Logger } from 'winston';

const logConfig = {
  transports: [
    new winston.transports.Console({
      level: 'warn',
    }),
    new winston.transports.File({
      level: 'error',
      filename: 'logs/server.log',
    }),
  ],
};

export const logger = winston.createLogger(logConfig);
export { Logger };
