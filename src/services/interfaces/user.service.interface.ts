import { User } from '@prisma/client';

export type PublicUser = Omit<User, 'password' | 'refreshToken'>;

export type UserCreateData = Pick<User, 'email' | 'username' | 'password'>;
export type UserUpdateData = Partial<Omit<UserCreateData, 'password'>>;

export type CreateUserResponse = {
    user: PublicUser;
    accessToken: string;
    refreshToken: string;
};

export interface IUserService {
    findAllUsers(): Promise<PublicUser[]>;
    createUser(data: UserCreateData): Promise<CreateUserResponse>;
    updateUser(id: string, data: UserUpdateData): Promise<PublicUser>;
    deleteUser(id: string): Promise<User>;
}
