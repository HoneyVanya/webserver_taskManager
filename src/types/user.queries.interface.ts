import { PublicUser } from './user.commands.interface.js';

export interface IUserQueries {
    findAllUsers(): Promise<PublicUser[]>;
}
