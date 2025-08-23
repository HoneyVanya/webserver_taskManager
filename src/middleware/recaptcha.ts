import { Request, Response, NextFunction, response } from 'express';
import asyncHandler from 'express-async-handler';
import axios from 'axios';
import { env } from '../config/env.js';
import logger from '../config/logger.js';

export const verifyRecaptcha = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const recaptchaToken = req.body.recaptchaToken;

        if (!recaptchaToken) {
            res.status(400);
            throw new Error('Recaptcha token is required');
        }

        try {
            const response = await axios.post(
                'https://www.google.com/recaptcha/api/siteverify',
                null,
                {
                    params: {
                        secret: env.RECAPTCHA_SECRET_KEY,
                        response: recaptchaToken,
                    },
                }
            );

            if (response.data.success === true) {
                next();
            } else {
                logger.warn(
                    { recaptchaErrors: response.data['error-codes'] },
                    'ReCaptcha verification failed'
                );
                res.status(401);
                throw new Error('Failed ReCaptcha verification.');
            }
        } catch (error) {
            logger.error(
                error,
                'Catastrofic error during Recaptcha verification.'
            );
            res.status(500);
            throw new Error('Error verifying ReCaptcha with Google`.');
        }
    }
);
