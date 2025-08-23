import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import axios from 'axios';
import { env } from '../config/env.js';

export const verifyRecaptcha = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const recaptchaToken = req.body.recaptchaToken;

        if (!recaptchaToken) {
            res.status(400);
            throw new Error('Recaptcha token is required');
        }

        try {
            const response = await axios.post(
                `https://www.google.com/recaptcha/api/siteverify?secret=${env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
            );

            if (response.data.success) {
                next();
            } else {
                res.status(401);
                throw new Error('Failed ReCaptcha verification.');
            }
        } catch (error) {
            throw new Error('Error verifying ReCaptcha.');
        }
    }
);
