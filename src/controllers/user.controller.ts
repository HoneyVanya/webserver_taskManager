import {
    controller,
    httpGet,
    httpPost,
    httpPut,
    httpDelete,
} from 'inversify-express-utils';
import { inject } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../types/types.js';
import { IUserCommands } from '../types/user.commands.interface.js';
import { IUserQueries } from '../types/user.queries.interface.js';
import { Request, Response } from 'express';
import { validate } from '../middleware/validate.js';
import { updateUserSchema, createUserSchema } from '../schemas/user.schema.js';
import { recapchaOrSkip } from '../middleware/recaptcha.js';

@controller('/api/users')
export class UserController {
    private readonly _userCommands: IUserCommands;
    private readonly _userQueries: IUserQueries;

    public constructor(
        @inject(TYPES.UserCommands) userCommands: IUserCommands,
        @inject(TYPES.UserQueries) userQueries: IUserQueries
    ) {
        this._userCommands = userCommands;
        this._userQueries = userQueries;
    }

    @httpGet('/')
    public async findAllUsers(req: Request, res: Response) {
        console.log('--- V2 of findAllUsers was called! ---');
        const users = await this._userQueries.findAllUsers();
        return res.json(users);
    }

    @httpPost('/', recapchaOrSkip, validate(createUserSchema))
    public async createUser(req: Request, res: Response) {
        const newUser = await this._userCommands.createUser(req.body);
        return res.status(201).json(newUser);
    }

    @httpPut('/:id', validate(updateUserSchema))
    public async updateUser(req: Request, res: Response) {
        const { id } = req.params;
        const updatedUser = await this._userCommands.updateUser(id, req.body);
        return res.json(updatedUser);
    }

    @httpDelete('/:id')
    public async deleteUser(req: Request, res: Response) {
        const { id } = req.params;
        await this._userCommands.deleteUser(id);
        return res.status(204).send();
    }
}
