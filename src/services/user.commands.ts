import prisma from '../config/db.js';
import { User } from '@prisma/client';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import {
    type CreateUserResponse,
    type UserCreateData,
    IUserCommands,
    type PublicUser,
    type UserUpdateData,
} from '../types/user.commands.interface.js';
import bcrypt from 'bcryptjs';
import { IAuthService } from '../types/auth.types.js';
import { TYPES } from '../types/types.js';

@injectable()
export class userCommands implements IUserCommands {
    private readonly _authService: IAuthService;

    public constructor(@inject(TYPES.AuthService) authService: IAuthService) {
        this._authService = authService;
    }

    public async createUser(data: UserCreateData): Promise<CreateUserResponse> {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                password: hashedPassword,
            },
        });
        const { accessToken, refreshToken } =
            await this._authService.generateTokens(user);
        await this._authService.saveRefreshToken(user.id, refreshToken);
        const { password, refreshToken: rt, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, accessToken, refreshToken };
    }
    public async updateUser(
        id: string,
        data: UserUpdateData
    ): Promise<PublicUser> {
        return prisma.user.update({ where: { id }, data });
    }
    public async deleteUser(id: string): Promise<User> {
        return prisma.user.delete({ where: { id } });
    }
}
