import 'reflect-metadata';
import request from 'supertest';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { app, prisma } from '../test-setup';

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

let testUser: User;
let authToken: string;

beforeAll(async () => {
    await prisma.$connect();
    const hashedPassword = await bcrypt.hash('password123', 10);
    testUser = await prisma.user.create({
        data: {
            email: 'task-test@example.com',
            username: 'tasktester',
            password: hashedPassword,
        },
    });
});

beforeEach(async () => {
    await prisma.task.deleteMany({ where: { authorId: testUser.id } });

    const response = await request(app).post('/auth/login').send({
        email: testUser.email,
        password: 'password123',
    });
    authToken = response.body.accessToken;
});

afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: testUser.id } });
    await prisma.$disconnect();
});

describe('Task API Endpoints', () => {
    it('GET /tasks should return an empty array for a new user', async () => {
        const response = await request(app)
            .get('/tasks')
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('POST /tasks should create a new task', async () => {
        const newTask = { title: 'My First Test Task' };

        const response = await request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${authToken}`)
            .send(newTask);

        expect(response.status).toBe(201);
        expect(response.body.title).toBe(newTask.title);
        expect(response.body.completed).toBe(false);

        const dbTasks = await prisma.task.findMany({
            where: { authorId: testUser.id },
        });
        expect(dbTasks.length).toBe(1);
        expect(dbTasks[0].title).toBe(newTask.title);
    });

    it('PUT /tasks/:id should update a task', async () => {
        const task = await prisma.task.create({
            data: { title: 'Initial Title', authorId: testUser.id },
        });

        const updates = { title: 'Updated Title', completed: true };

        const response = await request(app)
            .put(`/tasks/${task.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(updates);

        expect(response.status).toBe(200);
        expect(response.body.title).toBe(updates.title);
        expect(response.body.completed).toBe(updates.completed);
    });

    it('DELETE /tasks/:id should delete a task', async () => {
        const task = await prisma.task.create({
            data: { title: 'To Be Deleted', authorId: testUser.id },
        });

        const response = await request(app)
            .delete(`/tasks/${task.id}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(204);

        const dbTask = await prisma.task.findUnique({ where: { id: task.id } });
        expect(dbTask).toBeNull();
    });
});
