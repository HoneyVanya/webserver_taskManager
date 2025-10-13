import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import prisma from '../config/db.js';
import { AppUser } from '../types/types.js';

export const checkTaskOwnership = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user as AppUser;
        const taskId = req.params.id;

        const task = await prisma.task.findFirst({
            where: {
                id: taskId,
                authorId: user.id,
            },
        });

        if (!task) {
            res.status(403);
            throw new Error(
                'Forbidden: You do not have permission to access this resource.'
            );
        }
        next();
    }
);
