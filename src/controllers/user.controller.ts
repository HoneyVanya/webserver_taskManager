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
import { IUserService } from '../types/user.types.js';
import { Request, Response } from 'express';
import { validate } from '../middleware/validate.js';
import { updateUserSchema, createUserSchema } from '../schemas/user.schema.js';

@controller('/users')
export class UserController {
    private readonly _userService: IUserService;

    public constructor(@inject(TYPES.UserService) userService: IUserService) {
        this._userService = userService;
    }

    @httpGet('/')
    public async findAllUsers(req: Request, res: Response) {
        const users = await this._userService.findAllUsers();
        return res.json(users);
    }

    @httpPost('/', validate(createUserSchema))
    public async createUser(req: Request, res: Response) {
        const newUser = await this._userService.createUser(req.body);
        return res.status(201).json(newUser);
    }

    @httpPut('/:id', validate(updateUserSchema))
    public async updateUser(req: Request, res: Response) {
        const { id } = req.params;
        const updatedUser = await this._userService.updateUser(id, req.body);
        return res.json(updatedUser);
    }

    @httpDelete('/:id')
    public async deleteUser(req: Request, res: Response) {
        const { id } = req.params;
        await this._userService.deleteUser(id);
        return res.status(204).send();
    }
}
