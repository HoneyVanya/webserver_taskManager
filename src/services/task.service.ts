import prisma from '../config/db';
import { Task } from '@prisma/client';

type TaskUpdateData = Partial<Pick<Task, 'title' | 'completed'>>;

export const findAllTasksForUser = async (userId: string): Promise<Task[]> => {
    return prisma.task.findMany({
        where: { authorId: userId },
    });
};

export const createTask = async (
    title: string,
    authorId: string
): Promise<Task> => {
    return prisma.task.create({ data: { title, authorId } });
};

export const updateTask = async (
    taskId: string,
    userId: string,
    data: TaskUpdateData
): Promise<Task> => {
    return prisma.task.update({
        where: { id: taskId, authorId: userId },
        data,
    });
};

export const deleteTask = async (
    taskId: string,
    userId: string
): Promise<Task> => {
    return prisma.task.delete({ where: { id: taskId, authorId: userId } });
};
