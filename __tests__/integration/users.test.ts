import request from 'supertest';
import express from 'express';
import { setupTestApp } from '../setup';
import prisma from '../../src/config/db';

describe('User API Endpoints', () => {
    let app: express.Application;

    beforeAll(() => {
        app = setupTestApp();
    });

    afterEach(async () => {
        await prisma.user.deleteMany();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should return a 409 Conflict error when registering with a duplicate email', async () => {
        const userData = {
            email: 'duplicate@example.com',
            username: 'testuser',
            password: 'password123',
        };

        const firstResponse = await request(app).post('/users').send(userData);
        expect(firstResponse.statusCode).toBe(201);

        const secondResponse = await request(app).post('/users').send(userData);

        expect(secondResponse.statusCode).toBe(409);
        expect(secondResponse.body.error).toBe('Conflict');
        expect(secondResponse.body.message).toContain('already exists');
    });

    it('should return a 400 Bad Request error if the password is too short', async () => {
        const userData = {
            email: 'test@example.com',
            username: 'testuser',
            password: '123',
        };

        const response = await request(app).post('/users').send(userData);

        expect(response.statusCode).toBe(400);

        expect(response.body.error).toBe('Validation failed');
        expect(response.body.details.password).toContain(
            'Password must be at least 6 characters long'
        );
    });
});
