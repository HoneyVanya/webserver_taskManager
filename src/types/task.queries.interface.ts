import { Task } from '@prisma/client';

export interface ITaskQueries {
    findAllTasksForUser(userId: string): Promise<Task[]>;
}
