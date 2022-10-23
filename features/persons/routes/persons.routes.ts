import { RoutesConfig } from '../../../config/routes.config';
import express from 'express';
import { asyncWrapper } from '../../../utils/wrapper.express';
import personsController from '../controllers/persons.controller';

export class PersonsRoutes extends RoutesConfig {
  constructor(app: express.Application) {
    super(app, 'PersonsRoutes');
  }

  registerRoutes() {
    this.app.route('/persons/bulk/bmi').post(asyncWrapper(personsController.processBMIInBulk));

    this.app.route('/persons/bmi').post(personsController.personBMI);

    this.app.route('/persons/seed').post(personsController.seedPersons);
    return this.app;
  }
}
