import { Request, Response, NextFunction } from 'express';

export const requireFields = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missing = fields.filter(field => !req.body[field]);
    if (missing.length > 0) {
      res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` });
      return;
    }
    next();
  };
};
