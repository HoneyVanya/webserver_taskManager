import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import * as taskService from '../services/task.service.js';

export const getAllTasks = asyncHandler(async (req: Request, res: Response) => {
    const tasks = await taskService.findAllTasksForUser(req.user!.id);
    res.json(tasks);
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
    const newTask = await taskService.createTask(req.body.title, req.user!.id);
    res.status(201).json(newTask);
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedTask = await taskService.updateTask(
        id,
        req.user!.id,
        req.body
    );
    res.json(updatedTask);
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await taskService.deleteTask(id, req.user!.id);
    res.status(204).send();
});
