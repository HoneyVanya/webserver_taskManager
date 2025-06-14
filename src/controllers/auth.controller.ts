import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import * as authService from '../services/auth.service';

export const loginController = asyncHandler(
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400);
            throw new Error('Please provide email and password');
        }

        const result = await authService.login(email, password);
        res.json(result);
    }
);
