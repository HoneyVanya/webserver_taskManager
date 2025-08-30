import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import { container } from './inversify.config.js';
import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import logger from './config/logger.js';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import swaggerJSDoc from 'swagger-jsdoc';
import passport from 'passport';
import './config/passport.js';
import SwaggerUi from 'swagger-ui-express';
import googleRoutes from './routes/google.routes.js';

const allowedOrigins = ['http://localhost:3000'];

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

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Manager API',
            version: '1.0.0',
            description:
                'A REST API for a simple Task Manager application, documented with Swagger',
            contact: {
                name: 'HoneyVanya',
            },
        },
        servers: [
            {
                url: `http://localhost:${env.PORT}`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: [
        './src/routes/auth.routes.ts',
        './src/routes/task.routes.ts',
        './src/routes/user.routes.ts',
    ],
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);

const server = new InversifyExpressServer(container);

server.setConfig((app) => {
    app.use(pinoHttp({ logger }));
    app.use(passport.initialize());
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use('/docs', SwaggerUi.serve, SwaggerUi.setup(swaggerSpec));
    app.use(googleRoutes);
});

server.setErrorConfig((app) => {
    app.use(errorHandler);
});

const app = server.build();

app.listen(env.PORT, () => {
    logger.info(`Server is running on http://localhost:${env.PORT}`);
});
