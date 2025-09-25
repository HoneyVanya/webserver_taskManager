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
import swaggetUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const server = new InversifyExpressServer(container);

server.setConfig((app) => {
    app.get('/healthz', (_req, res) => {
        res.status(200).send('OK');
    });
    app.use(pinoHttp({ logger }));
    app.use(passport.initialize());
    const corsOptions = {
        origin: [
            'http://localhost:5173',
            'https://tasks.webservertaskmanager.com',
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    };
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(googleRoutes);
});

server.setErrorConfig((app) => {
    app.use(errorHandler);
});

const app = server.build();

if (process.env.NODE_ENV !== 'production') {
    const swaggerDocument = YAML.load(path.join(process.cwd(), 'swagger.yaml'));
    app.use('/docs', swaggetUi.serve, swaggetUi.setup(swaggerDocument));
    logger.info('Swagger docs are enabled at /docs');
}

app.listen(env.PORT, () => {
    logger.info(`Server is running on http://localhost:${env.PORT}`);
});
