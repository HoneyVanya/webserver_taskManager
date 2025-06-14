import type { PublicUser } from '../services/user.service';

declare global {
    namespace Express {
        export interface Request {
            user?: PublicUser;
        }
    }
}
