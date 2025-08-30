import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import { container } from './inversify.config.js';
import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import logger from './config/logger.js';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import passport from 'passport';
import './config/passport.js';
import googleRoutes from './routes/google.routes.js';

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5000'];

const corsOptions = {
    origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void
    ) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};
const server = new InversifyExpressServer(container);

server.setConfig((app) => {
    app.use(pinoHttp({ logger }));
    app.use(passport.initialize());
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(googleRoutes);
});

server.setErrorConfig((app) => {
    app.use(errorHandler);
});

const app = server.build();

app.listen(env.PORT, () => {
    logger.info(`Server is running on http://localhost:${env.PORT}`);
});
