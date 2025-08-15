import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import prisma from '../config/db.js';
import { env } from '../config/env.js';

export const protect = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            try {
                token = req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, env.JWT_SECRET) as {
                    id: string;
                };

                const foundUser = await prisma.user.findUnique({
                    where: { id: decoded.id },
                    select: {
                        id: true,
                        email: true,
                        username: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                });

                if (!foundUser) {
                    res.status(401);
                    throw new Error(
                        'Not authorized, user for this token no longer exists'
                    );
                }

                req.user = foundUser;

                next();
            } catch (error) {
                console.error(error);
                res.status(401);
                throw new Error('Not authorized, token failed');
            }
        }

        if (!token) {
            res.status(401);
            throw new Error('Not authorized, no token');
        }
    }
);
