import prisma from '../config/db.js';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateTokens, saveRefreshToken } from './auth.service.js';

export type PublicUser = Omit<User, 'password' | 'refreshToken'>;

type UserCreateData = Pick<User, 'email' | 'username' | 'password'>;
type UserUpdateData = Partial<Omit<UserCreateData, 'password'>>;

type CreateUserResponse = {
    user: PublicUser;
    accessToken: string;
    refreshToken: string;
};

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

export const createUser = async (
    data: UserCreateData
): Promise<CreateUserResponse> => {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
        data: {
            username: data.username,
            email: data.email,
            password: hashedPassword,
        },
    });
    const { accessToken, refreshToken } = generateTokens(user);
    await saveRefreshToken(user.id, refreshToken);
    const { password, refreshToken: rt, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, accessToken, refreshToken };
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
