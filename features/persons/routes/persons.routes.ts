import { RoutesConfig } from '../../../config/routes.config';
import express from 'express';
import { asyncWrapper } from '../../../utils/wrapper.express';
import personsController from '../controllers/persons.controller';

export class PersonsRoutes extends RoutesConfig {
  constructor(app: express.Application) {
    super(app, 'PersonsRoutes');
  }

  registerRoutes() {
    /**
     * @swagger
     * /persons/bulk/bmi:
     *  post:
     *    summary: Compute BMI for persons in bulk.
     *    tags: [BMI, Person]
     *    description: Processes persons data and compute BMI for individuals in a background process.
     *    responses:
     *      200:
     *        description: A JSON object containing key to download the processed results
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                key:
     *                  type: string
     *                  description: key to retrieve the file later
     */
    this.app.route('/persons/bulk/bmi').post(asyncWrapper(personsController.processBMIInBulk));

    /**
     * @swagger
     * /persons/bmi:
     *  post:
     *    summary: Computes given person BMI.
     *    tags: [BMI, Person]
     *    description: Process person height, weight and returns computed BMI.
     *    requestBody:
     *      description: Need Person inputs
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              HeightCm:
     *                type: string
     *              WeightKg:
     *                type: string
     *              Gender:
     *                type: string
     *                enum:
     *                  - Male
     *                  - Female
     *    responses:
     *      200:
     *        description: A JSON object containing person BMI metrics
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                height:
     *                  type: number
     *                weight:
     *                  type: number
     *                health_risk:
     *                  type: string
     *                  description: Health risk (Malnutrition, low risk etc)
     *                category:
     *                  type: string
     *                  description: BMI category (underweight, normal weight etc)
     *                bmi_range:
     *                  type: string
     *                  description: BMI range (18.5 to 24.9 or 30 to 34.9 etc)
     */
    this.app.route('/persons/bmi').post(personsController.personBMI);

    /**
     * @swagger
     * /persons/seed:
     *  post:
     *    summary: Seeds persons data.
     *    tags: [Person]
     *    description: Create random persons with variable height, weight and gender.
     *    responses:
     *      200:
     *        description: Returns success status
     *        content:
     *          application/json:
     */
    this.app.route('/persons/seed').post(personsController.seedPersons);
    return this.app;
  }
}
