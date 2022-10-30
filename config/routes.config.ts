import express from 'express';
import { logger, Logger } from './log.config';

export abstract class RoutesConfig {
  app: express.Application;
  name: string;

  constructor(app: express.Application, name: string) {
    this.app = app;
    this.name = name;
    this.registerRoutes();
  }

  get appName() {
    return this.name;
  }

  abstract registerRoutes(): express.Application;

  get log(): Logger {
    return logger;
  }
}
