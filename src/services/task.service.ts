import prisma from '../config/db.js';
import { Task } from '@prisma/client';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { ITaskService } from '../types/task.types.js';
import { TaskUpdateData } from '../types/task.types.js';

@injectable()
export class TaskService implements ITaskService {
    public async findAllTasksForUser(userId: string): Promise<Task[]> {
        return prisma.task.findMany({
            where: { authorId: userId },
        });
    }
    public async createTask(title: string, authorId: string): Promise<Task> {
        return prisma.task.create({ data: { title, authorId } });
    }
    public async updateTask(
        taskId: string,
        userId: string,
        data: TaskUpdateData
    ): Promise<Task> {
        return prisma.task.update({
            where: { id: taskId, authorId: userId },
            data,
        });
    }
    public async deleteTask(userId: string, taskId: string): Promise<Task> {
        return prisma.task.delete({ where: { id: taskId, authorId: userId } });
    }
}
