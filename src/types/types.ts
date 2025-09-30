import { User as PrismaUser } from '@prisma/client';
export const TYPES = {
    TaskCommands: Symbol.for('TaskCommands'),
    TaskQueries: Symbol.for('TaskQueries'),
    UserCommands: Symbol.for('UserCommands'),
    UserQueries: Symbol.for('UserQueries'),
    AuthService: Symbol.for('AuthService'),
};
export type AppUser = Omit<PrismaUser, 'password' | 'refreshToken'>;
