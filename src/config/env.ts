import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    PORT: z.coerce.number().default(3000),
    JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.log(
        '❌ Invalid environment variables:',
        parsedEnv.error.flatten().fieldErrors
    );

    throw new Error('Invalid environment variables');
}

export const env = parsedEnv.data;
