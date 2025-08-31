import { injectable } from 'inversify';
import 'reflect-metadata';
import prisma from '../config/db';
import { IUserQueries } from '../types/user.queries.interface';
import { PublicUser } from '../types/user.commands.interface';

@injectable()
export class userQueries implements IUserQueries {
    public async findAllUsers(): Promise<PublicUser[]> {
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
