import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import asyncHandler from 'express-async-handler';

export const validate = (schema: AnyZodObject) =>
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await schema.parseAsync(req.body);
        next();
    });
