import { User } from '@prisma/client';

export interface IAuthService {
    generateTokens(user: User): any;
    saveRefreshToken(userId: string, refreshToken: string): any;
    login(email: string, pass: string): any;
    refreshTokens(sentRefreshToken: string): any;
    logout(userId: string): any;
}
