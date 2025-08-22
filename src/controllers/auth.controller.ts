import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import * as authService from '../services/auth.service.js';
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';

export const loginController = asyncHandler(
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400);
            throw new Error('Please provide email and password');
        }

        const result = await authService.login(email, password);

        if (!result) {
            res.status(401);
            throw new Error('Invalid credentials');
        }

        res.json(result);
    }
);

export const refreshController = asyncHandler(
    async (req: Request, res: Response) => {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400);
            throw new Error('Refresh Token is required');
        }
        const newTokens = await authService.refreshTokens(refreshToken);
        if (!newTokens) {
            res.status(401);
            throw new Error('Invalid or expired refresh token');
        }

        res.json(newTokens);
    }
);

export const logoutController = asyncHandler(
    async (req: Request, res: Response) => {
        const result = await authService.logout(req.user!.id);
        res.json(result);
    }
);

export const googleCallbackController = (req: Request, res: Response) => {
    if (!req.user) {
        return res
            .status(401)
            .redirect('http://localhost:3000/login?error=auth_failed');
    }
    const payload = {
        id: req.user.id,
        email: req.user.email,
        username: req.user.username,
    };
    const accessTokenOptions: SignOptions = {
        expiresIn: env.JWT_ACCESS_EXPIRATION as SignOptions['expiresIn'],
    };
    const accessToken = jwt.sign(
        payload,
        env.JWT_ACCESS_SECRET,
        accessTokenOptions
    );

    res.redirect(`http://localhost:3000?token=${accessToken}`);
};
