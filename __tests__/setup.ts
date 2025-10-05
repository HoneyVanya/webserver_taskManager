import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import express from 'express';

import { container } from '../src/inversify.config.js';
import { errorHandler } from '../src/middleware/errorHandler.js';
import passport from 'passport';
import '../src/config/passport.js';
import googleRoutes from '../src/routes/google.routes.js';

export function setupTestApp() {
    const server = new InversifyExpressServer(container);

    server.setConfig((app) => {
        app.use(passport.initialize());
        app.use(express.json());
        app.use(googleRoutes);
    });

    server.setErrorConfig((app) => {
        app.use(errorHandler);
    });

    const app = server.build();
    return app;
}
