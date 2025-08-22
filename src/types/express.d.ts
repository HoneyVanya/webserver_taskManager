import { User as PublicUser } from '@prisma/client';

type AppUser = Omit<PrismaUser, 'password' | 'refreshToken'>;

declare global {
    namespace Express {
        export interface User extends AppUser {}
        export interface Request {
            user?: User;
        }
    }
}
