import { User } from '@prisma/client';
import { AppUser } from './types';

export type UserCreateData = Pick<User, 'email' | 'username' | 'password'>;
export type UserUpdateData = Partial<Omit<UserCreateData, 'password'>>;

export type CreateUserResponse = {
    user: AppUser;
    accessToken: string;
    refreshToken: string;
};

export interface IUserCommands {
    createUser(data: UserCreateData): Promise<CreateUserResponse>;
    updateUser(id: string, data: UserUpdateData): Promise<AppUser>;
    deleteUser(id: string): Promise<User>;
}
