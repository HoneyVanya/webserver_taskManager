// __tests__/integration/tasks.test.ts
import request from 'supertest';
import express from 'express';
import { setupTestApp } from '../setup';
import prisma from '../../src/config/db';

describe('Task API Endpoints', () => {
    let app: express.Application;
    let token: string;
    let userId: string;

    beforeAll(async () => {
        app = setupTestApp();
        // Clean up the test database before running tests
        await prisma.user.deleteMany();
        await prisma.task.deleteMany();

        // 1. Register a new user for the test suite
        const userCredentials = {
            email: 'testuser@example.com',
            username: 'testuser',
            password: 'password123',
        };
        const registerRes = await request(app)
            .post('/users')
            .send(userCredentials);

        expect(registerRes.statusCode).toBe(201);
        token = registerRes.body.accessToken;
        userId = registerRes.body.user.id;
    });

    afterAll(async () => {
        await prisma.user.deleteMany();
        await prisma.$disconnect();
    });

    it('should not allow fetching tasks without a token', async () => {
        const res = await request(app).get('/tasks');
        expect(res.statusCode).toBe(401);
    });

    it('should fetch an empty array of tasks for a new user', async () => {
        const res = await request(app)
            .get('/tasks')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    it('should create a new task', async () => {
        const res = await request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'My first test task' });

        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe('My first test task');
        expect(res.body.completed).toBe(false);
        expect(res.body.authorId).toBe(userId);
    });

    it('should fetch all tasks for the user, including the new one', async () => {
        const res = await request(app)
            .get('/tasks')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].title).toBe('My first test task');
    });
});
