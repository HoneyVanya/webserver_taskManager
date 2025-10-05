import { controller, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../types/types.js';
import { IAuthService } from '../types/auth.types.js';
import { Request, Response } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, refreshTokenSchema } from '../schemas/auth.schema.js';
import { AppUser } from '../types/types.js';

@controller('/api/auth')
export class AuthController {
    private readonly _authService: IAuthService;

    public constructor(@inject(TYPES.AuthService) authService: IAuthService) {
        this._authService = authService;
    }

    @httpPost('/login', authLimiter, validate(loginSchema))
    public async login(req: Request, res: Response) {
        const { email, password } = req.body;

        const result = await this._authService.login(email, password);
        if (!result) {
            res.status(401);
            throw new Error('Invalid credentials');
        }

        return res.json(result);
    }

    @httpPost('/refresh', validate(refreshTokenSchema))
    public async refresh(req: Request, res: Response) {
        const { refreshToken } = req.body;

        const newTokens = await this._authService.refreshTokens(refreshToken);
        if (!newTokens) {
            res.status(401);
            throw new Error('Invalid or expired refresh token');
        }
        return res.json(newTokens);
    }

    @httpPost('/logout', protect)
    public async logout(req: Request, res: Response) {
        const user = req.user as AppUser;
        const result = await this._authService.logout(user.id);
        return res.json(result);
    }
}
