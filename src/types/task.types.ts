import { Task } from '@prisma/client';

export type TaskUpdateData = Partial<Pick<Task, 'title' | 'completed'>>;

export interface ITaskService {
    findAllTasksForUser(userId: string): Promise<Task[]>;
    createTask(title: string, authorId: string): Promise<Task>;
    updateTask(
        taskId: string,
        userId: string,
        data: TaskUpdateData
    ): Promise<Task>;
    deleteTask(userId: string, taskId: string): Promise<Task>;
}
