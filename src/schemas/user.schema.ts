import { z } from 'zod';

export const createUserSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .email('Not a valid email'),
    username: z
        .string({ required_error: 'Username is required' })
        .min(3, 'Username must be at least 3 characters long'),
    password: z
        .string({ required_error: 'Password is required' })
        .min(6, 'Password must be at least 6 characters long'),
});

export const updateUserSchema = z.object({
    email: z.string().email('Not a valid email').optional(),
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters long')
        .optional(),
});
