import { controller, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../types/types.js';
import { IAuthService } from '../services/interfaces/auth.service.interface.js';
import { Request, Response } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

@controller('/auth')
export class AuthController {
    private readonly _authService: IAuthService;

    public constructor(@inject(TYPES.AuthService) authService: IAuthService) {
        this._authService = authService;
    }

    @httpPost('/login', authLimiter)
    public async login(req: Request, res: Response) {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400);
            throw new Error('Please provide email and password');
        }

        const result = await this._authService.login(email, password);

        if (!result) {
            res.status(401);
            throw new Error('Invalid credentials');
        }

        return res.json(result);
    }

    @httpPost('/refresh')
    public async refresh(req: Request, res: Response) {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400);
            throw new Error('Refresh Token is required');
        }
        const newTokens = await this._authService.refreshTokens(refreshToken);
        if (!newTokens) {
            res.status(401);
            throw new Error('Invalid or expired refresh token');
        }

        return res.json(newTokens);
    }

    @httpPost('/logout', protect)
    public async logout(req: Request, res: Response) {
        const result = await this._authService.logout(req.user!.id);
        return res.json(result);
    }
}
