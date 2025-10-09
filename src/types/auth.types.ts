import { AppUser } from './types';

export interface IAuthService {
    generateTokens(
        user: AppUser
    ): Promise<{ accessToken: string; refreshToken: string }>;
    saveRefreshToken(userId: string, refreshToken: string): any;
    login(email: string, pass: string): any;
    refreshTokens(sentRefreshToken: string): any;
    logout(userId: string): any;
}
