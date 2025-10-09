import { AppUser } from './types';

export interface IUserQueries {
    findAllUsers(): Promise<AppUser[]>;
}
