import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    limit: 5,

    message: {
        message:
            'Too many login attempts from this IP, please try again after 15 minutes',
    },

    standardHeaders: 'draft-8',
    legacyHeaders: false,
});
