import { PublicUser } from './user.commands.interface';

export interface IUserQueries {
    findAllUsers(): Promise<PublicUser[]>;
}
