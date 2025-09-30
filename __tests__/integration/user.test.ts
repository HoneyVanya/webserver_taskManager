import 'reflect-metadata';
import express from 'express';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';

jest.mock('../../src/config/db.js', () => ({
    __esModule: true,
    default: new PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL_TEST,
            },
        },
    }),
}));

import { InversifyExpressServer } from 'inversify-express-utils';
import { container } from '../../src/inversify.config';
import prisma from '../../src/config/db.js';

const app = new InversifyExpressServer(container)
    .setConfig((app) => {
        app.use(express.json());
    })
    .build();

beforeAll(async () => {
    await prisma.$connect();
});

afterAll(async () => {
    await prisma.$disconnect();
});

describe('User API Endpoints', () => {
    beforeEach(async () => {
        await prisma.task.deleteMany({});
        await prisma.user.deleteMany({});
    });

    it('GET /users should return an empty array when no users exist', async () => {
        const response = await request(app).get('/users');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('POST /users should create a new user successfully', async () => {
        const newUser = {
            email: 'test@example.com',
            username: 'tester',
            password: 'password123',
        };

        const response = await request(app).post('/users').send(newUser);

        expect(response.status).toBe(201);
        expect(response.body.user).toBeDefined();
        expect(response.body.user.email).toBe(newUser.email);
        expect(response.body.accessToken).toBeDefined();

        const dbUser = await prisma.user.findUnique({
            where: { email: newUser.email },
        });
        expect(dbUser).not.toBeNull();
        expect(dbUser?.username).toBe(newUser.username);
    });
});
