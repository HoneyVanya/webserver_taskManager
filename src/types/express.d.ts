import type { PublicUser } from '../services/user.service.js';

declare global {
    namespace Express {
        export interface Request {
            user?: PublicUser;
        }
    }
}
