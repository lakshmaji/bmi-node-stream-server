import { RoutesConfig } from '../../../config/routes.config';
import express from 'express';
import { asyncWrapper } from '../../../utils/wrapper.express';
import bmiController from '../controllers/bmi.controller';

export class BMIRoutes extends RoutesConfig {
  constructor(app: express.Application) {
    super(app, 'BMIRoutes');
  }

  registerRoutes() {
    /**
     * @swagger
     * /bmi/stats:
     *  get:
     *    summary: View BMI stats.
     *    tags: [BMI]
     *    description: BMI persons count w.r.t BMI range chart.
     *    responses:
     *      200:
     *        description: Returns JSON object
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                stats:
     *                  type: array
     *                  items:
     *                    type: object
     *                    properties:
     *                      range:
     *                        type: string
     *                        count: integer
     *            example:
     *              - range: 18.4 and below
     *                count: 61
     *              - range: 18.5-24.9
     *                count: 2
     *              - range: 25-29.9
     *                count: 2
     *              - range: 30-34.9
     *                count: 1
     *              - range: 35-39.9
     *                count: 1
     *              - range: 40 and above
     *                count: 3
     */
    this.app.route('/bmi/stats').get(asyncWrapper(bmiController.getStats));

    return this.app;
  }
}
