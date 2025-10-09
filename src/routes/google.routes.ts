import { Router, Request, Response } from 'express';
import passport from 'passport';
import { env } from '../config/env.js';
import { container } from '../inversify.config.js';
import { TYPES, AppUser } from '../types/types.js';
import { IAuthService } from '../types/auth.types.js';

const router = Router();

const GoogleCallbackController = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.redirect(`${env.FRONTEND_URL}/login?error=auth_failed`);
    }
    const user = req.user as AppUser;

    try {
        const authService = container.get<IAuthService>(TYPES.AuthService);

        const { accessToken, refreshToken } = await authService.generateTokens(
            user
        );

        await authService.saveRefreshToken(user.id, refreshToken);

        res.redirect(
            `${env.FRONTEND_URL}?token=${accessToken}&refreshToken=${refreshToken}`
        );
    } catch (error) {
        console.error('Error during Google callback token generation:', error);
        res.redirect(`${env.FRONTEND_URL}/login?error=token_generation_failed`);
    }
};

router.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
    '/auth/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: `${env.FRONTEND_URL}/login?error=true`,
    }),
    GoogleCallbackController
);

export default router;
