import {
    controller,
    httpGet,
    httpPost,
    httpDelete,
    httpPut,
} from 'inversify-express-utils';
import { inject } from 'inversify';
import 'reflect-metadata';
import { Request, Response } from 'express';
import { TYPES } from '../types/types.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { updateTaskSchema, createTaskSchema } from '../schemas/task.schema.js';
import { ITaskCommands } from '../types/task.commands.interface.js';
import { ITaskQueries } from '../types/task.queries.interface.js';
import { AppUser } from '../types/types.js';

@controller('/api/tasks', protect)
export class TaskController {
    private readonly _taskCommands: ITaskCommands;
    private readonly _taskQueries: ITaskQueries;

    public constructor(
        @inject(TYPES.TaskCommands) taskCommands: ITaskCommands,
        @inject(TYPES.TaskQueries) taskQueries: ITaskQueries
    ) {
        this._taskCommands = taskCommands;
        this._taskQueries = taskQueries;
    }

    @httpGet('/')
    public async getAllTasks(req: Request, res: Response) {
        const user = req.user as AppUser;
        const tasks = await this._taskQueries.findAllTasksForUser(user.id);
        return res.json(tasks);
    }

    @httpPost('/', validate(createTaskSchema))
    public async createTask(req: Request, res: Response) {
        const user = req.user as AppUser;
        const newTask = await this._taskCommands.createTask(
            req.body.title,
            user.id
        );
        return res.status(201).json(newTask);
    }

    @httpPut('/:id', validate(updateTaskSchema))
    public async updateTask(req: Request, res: Response) {
        const { id } = req.params;
        const user = req.user as AppUser;
        const updateTask = await this._taskCommands.updateTask(
            id,
            user.id,
            req.body
        );
        return res.json(updateTask);
    }

    @httpDelete('/:id')
    public async deleteTask(req: Request, res: Response) {
        const { id } = req.params;
        const user = req.user as AppUser;
        await this._taskCommands.deleteTask(user.id, id);
        return res.status(204).send();
    }
}
