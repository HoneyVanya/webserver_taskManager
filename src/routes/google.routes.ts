import { Router, Request, Response } from 'express';
import passport from 'passport';
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';

const router = Router();

const GoogleCallbackController = (req: Request, res: Response) => {
    if (!req.user) {
        return res.redirect(`${env.FRONTEND_URL}/login?error=auth_failed`);
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

    res.redirect(`${env.FRONTEND_URL}?token=${accessToken}`);
};

router.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
    '/auth/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: '/login',
    }),
    GoogleCallbackController
);

export default router;
