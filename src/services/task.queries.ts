import { injectable } from 'inversify';
import 'reflect-metadata';
import prisma from '../config/db';
import { ITaskQueries } from '../types/task.queries.interface';
import type { Task } from '@prisma/client';

@injectable()
export class taskQueries implements ITaskQueries {
    public async findAllTasksForUser(userId: string): Promise<Task[]> {
        return prisma.task.findMany({ where: { authorId: userId } });
    }
}
