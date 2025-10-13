import prisma from '../config/db.js';
import { Task } from '@prisma/client';
import { injectable } from 'inversify';
import 'reflect-metadata';
import {
    ITaskCommands,
    TaskUpdateData,
} from '../types/task.commands.interface.js';

@injectable()
export class taskCommands implements ITaskCommands {
    public async createTask(title: string, authorId: string): Promise<Task> {
        return prisma.task.create({ data: { title, authorId } });
    }
    public async updateTask(
        taskId: string,
        _userId: string,
        data: TaskUpdateData
    ): Promise<Task> {
        return prisma.task.update({
            where: { id: taskId },
            data,
        });
    }
    public async deleteTask(_userId: string, taskId: string): Promise<Task> {
        return prisma.task.delete({ where: { id: taskId } });
    }
}
