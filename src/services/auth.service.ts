import prisma from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '@prisma/client';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { IAuthService } from '../types/auth.types.js';

@injectable()
export class AuthService implements IAuthService {
    public async generateTokens(user: User) {
        const accessTokenOptions: SignOptions = {
            expiresIn: env.JWT_ACCESS_EXPIRATION as SignOptions['expiresIn'],
        };

        const refreshTokenOptions: SignOptions = {
            expiresIn: env.JWT_REFRESH_EXPIRATION as SignOptions['expiresIn'],
        };
        const accessToken = jwt.sign(
            { id: user.id, email: user.email, username: user.username },
            env.JWT_ACCESS_SECRET,
            accessTokenOptions
        );
        const refreshToken = jwt.sign(
            { id: user.id },
            env.JWT_REFRESH_SECRET,
            refreshTokenOptions
        );
        return { accessToken, refreshToken };
    }
    public async saveRefreshToken(userId: string, refreshToken: string) {
        const hashedToken = await bcrypt.hash(refreshToken, 10);
        await prisma.user.update({
            where: { id: userId },
            data: { refreshToken: hashedToken },
        });
    }
    public async login(email: string, pass: string) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(pass, user.password);
        if (!isPasswordValid) return null;

        const { accessToken, refreshToken } = await this.generateTokens(user);
        await this.saveRefreshToken(user.id, refreshToken);

        return { accessToken, refreshToken };
    }
    public async refreshTokens(sentRefreshToken: string) {
        let decoded;
        try {
            decoded = jwt.verify(sentRefreshToken, env.JWT_REFRESH_SECRET) as {
                id: string;
            };
        } catch (error) {
            return null;
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user || !user.refreshToken) {
            return null;
        }

        const isTokenValid = await bcrypt.compare(
            sentRefreshToken,
            user.refreshToken
        );
        if (!isTokenValid) {
            return null;
        }

        const { accessToken, refreshToken } = await this.generateTokens(user);
        await this.saveRefreshToken(user.id, refreshToken);

        return { accessToken, refreshToken };
    }
    async logout(userId: string) {
        await prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
        return { message: 'Logged out successfully' };
    }
}
