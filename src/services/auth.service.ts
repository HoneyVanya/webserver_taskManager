import prisma from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const login = async (email: string, pass: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) return null;

    const token = jwt.sign({ id: user.id, email: user.email }, env.JWT_SECRET, {
        expiresIn: '1d',
    });

    return { token };
};
