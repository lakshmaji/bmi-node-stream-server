import { NextFunction, Request, Response } from "express"

export const asyncWrapper = (asyncFn: (req: Request, res: Response) => Promise<void>) => {
    return function (req: Request, res: Response, next: NextFunction) {
      asyncFn(req, res).catch(next)
    }
  }
  