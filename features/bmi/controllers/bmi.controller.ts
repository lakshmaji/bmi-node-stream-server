import express from 'express';
import { getBMIStats } from '../core/bmi';

class BMIController {
  public getStats = async (req: express.Request, res: express.Response) => {
    const items = await getBMIStats();

    res.status(200).json({
      items,
    });
  };
}
export default new BMIController();
