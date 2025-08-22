import prisma from '../config/db.js';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';

export type PublicUser = Omit<User, 'password' | 'refreshToken'>;

type UserCreateData = Pick<User, 'email' | 'username' | 'password'>;
type UserUpdateData = Partial<Omit<UserCreateData, 'password'>>;

export const findAllUsers = async (): Promise<PublicUser[]> => {
    return prisma.user.findMany({
        select: {
            id: true,
            email: true,
            username: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

export const createUser = async (data: UserCreateData): Promise<PublicUser> => {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
        data: {
            ...data,
            password: hashedPassword,
        },
    });
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

export const updateUser = async (
    id: string,
    data: UserUpdateData
): Promise<PublicUser> => {
    return prisma.user.update({ where: { id }, data });
};

export const deleteUser = async (id: string): Promise<User> => {
    return prisma.user.delete({ where: { id } });
};
