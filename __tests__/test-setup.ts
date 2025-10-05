import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import { PrismaClient } from '@prisma/client';
import express from 'express';

// Mock the db module BEFORE anything else is imported
jest.mock('../src/config/db.js', () => ({
    __esModule: true,
    default: new PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL_TEST,
            },
        },
    }),
}));

// NOW, import the container and the mocked prisma
import { container } from '../src/inversify.config.js';
import prisma from '../src/config/db.js';

// Build the application
const app = new InversifyExpressServer(container)
    .setConfig((app) => {
        app.use(express.json());
    })
    .build();

// Export the app and the mocked prisma instance for tests to use
export { app, prisma };
