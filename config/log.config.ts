import winston, { Logger } from 'winston';

const logConfig = {
  transports: [
    new winston.transports.Console({
      level: 'warn',
    }),
    new winston.transports.File({
      level: 'info',
      filename: 'tmp/logs/combined.log',
    }),
    new winston.transports.File({
      level: 'error',
      filename: 'tmp/logs/errors.log',
    }),
  ],
};

export const logger = winston.createLogger(logConfig);
export { Logger };
