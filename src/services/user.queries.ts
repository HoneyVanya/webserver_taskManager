import { injectable } from 'inversify';
import 'reflect-metadata';
import prisma from '../config/db.js';
import { IUserQueries } from '../types/user.queries.interface.js';
import { AppUser } from '../types/types.js';

@injectable()
export class userQueries implements IUserQueries {
    public async findAllUsers(): Promise<AppUser[]> {
        return prisma.user.findMany({
            select: {
                id: true,
                email: true,
                username: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
}
