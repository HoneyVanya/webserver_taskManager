import { Response, Request, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import logger from '../config/logger.js';

export const errorHandler: ErrorRequestHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    logger.error(err);

    if (res.statusCode === 401) {
        res.status(401).json({
            error: 'Unauthorized',
            message: err.message,
        });
        return;
    }

    if (err instanceof ZodError) {
        res.status(400).json({
            error: 'Validation failed',
            details: err.flatten().fieldErrors,
        });
        return;
    }

    if (err.code === 'P2025') {
        res.status(404).json({
            error: 'Not Found',
            message: err.meta?.cause || 'The requested resourse was not found.',
        });
        return;
    }

    if (err.code === 'P2003') {
        res.status(400).json({
            error: 'Bad Request',
            message: `Invalid input: the related recond in '${err.meta?.field_name}' does not exist.`,
        });
        return;
    }

    if (err.code === 'P2002') {
        res.status(409).json({
            error: 'Conflict',
            message: `A record with this ${err.meta?.target.join(', ')} already exists.`,
        });
        return;
    }

    res.status(500).json({
        error: 'Internal Server Error',
        message: 'An unexpected error occured on the server.',
    });
    return;
};
