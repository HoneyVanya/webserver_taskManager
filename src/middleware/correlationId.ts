import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';

declare global {
    namespace Express {
        interface Request {
            id: string;
        }
    }
}

export const correlationId = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const id = randomUUID();
    req.id = id;
    res.setHeader('X-Request-Id', id);

    next();
};
