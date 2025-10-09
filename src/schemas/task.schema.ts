import { z } from 'zod';

export const createTaskSchema = z.object({
    title: z
        .string({ required_error: 'Title is required' })
        .min(1, 'You must enter title'),
});

export const updateTaskSchema = z.object({
    title: z.string().min(1, 'Title can not be empty').optional(),
    completed: z.boolean().optional(),
});
