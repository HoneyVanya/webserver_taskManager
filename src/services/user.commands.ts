import prisma from '../config/db.js';
import { User } from '@prisma/client';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import {
    type CreateUserResponse,
    type UserCreateData,
    IUserCommands,
    type UserUpdateData,
} from '../types/user.commands.interface.js';
import bcrypt from 'bcryptjs';
import { IAuthService } from '../types/auth.types.js';
import { TYPES, AppUser } from '../types/types.js';

@injectable()
export class userCommands implements IUserCommands {
    private readonly _authService: IAuthService;

    public constructor(@inject(TYPES.AuthService) authService: IAuthService) {
        this._authService = authService;
    }

    public async createUser(data: UserCreateData): Promise<CreateUserResponse> {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const { user, accessToken, refreshToken } = await prisma.$transaction(
            async (tx) => {
                const createdUser = await tx.user.create({
                    data: {
                        username: data.username,
                        email: data.email,
                        password: hashedPassword,
                    },
                });

                await tx.task.create({
                    data: {
                        title: 'Welcome to your new Task Manager',
                        authorId: createdUser.id,
                    },
                });

                const tokens = await this._authService.generateTokens(
                    createdUser
                );
                const hashedRefreshToken = await bcrypt.hash(
                    tokens.refreshToken,
                    10
                );

                const updatedUser = await tx.user.update({
                    where: { id: createdUser.id },
                    data: { refreshToken: hashedRefreshToken },
                });

                return { user: updatedUser, ...tokens };
            }
        );

        const { password, refreshToken: rt, ...userWithoutPassword } = user;

        return { user: userWithoutPassword, accessToken, refreshToken };
    }
    public async updateUser(
        id: string,
        data: UserUpdateData
    ): Promise<AppUser> {
        return prisma.user.update({ where: { id }, data });
    }
    public async deleteUser(id: string): Promise<User> {
        return prisma.user.delete({ where: { id } });
    }
}
