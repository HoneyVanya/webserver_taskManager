import { Request, Response, NextFunction } from 'express';

interface RequestWithLogger {
    log: {
        info: (obj: object, msg?: string) => void;
    };
}

export const requestTimer = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        (req as RequestWithLogger).log.info(
            {
                duration,
                statusCode: res.statusCode,
            },
            `Request processed`
        );
    });

    next();
};
