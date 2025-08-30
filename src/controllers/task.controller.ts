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
import { ITaskService } from '../types/task.types.js';
import { protect } from '../middleware/auth.middleware.js';

@controller('/tasks', protect)
export class TaskController {
    private readonly _taskService: ITaskService;

    public constructor(@inject(TYPES.TaskService) taskService: ITaskService) {
        this._taskService = taskService;
    }

    @httpGet('/')
    public async getAllTasks(req: Request, res: Response) {
        const tasks = await this._taskService.findAllTasksForUser(req.user!.id);
        return res.json(tasks);
    }

    @httpPost('/')
    public async createTask(req: Request, res: Response) {
        const newTask = await this._taskService.createTask(
            req.body.title,
            req.user!.id
        );
        return res.status(201).json(newTask);
    }

    @httpPut('/:id')
    public async updateTask(req: Request, res: Response) {
        const { id } = req.params;
        const updateTask = await this._taskService.updateTask(
            id,
            req.user!.id,
            req.body
        );
        return res.json(updateTask);
    }

    @httpDelete('/:id')
    public async deleteTask(req: Request, res: Response) {
        const { id } = req.params;
        await this._taskService.deleteTask(id, req.user!.id);
        return res.status(204).send();
    }
}
