import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import * as userService from '../services/user.service.js';

export const getAllUsers = asyncHandler(
    async (_req: Request, res: Response) => {
        const users = await userService.findAllUsers();
        res.json(users);
    }
);

export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedUser = await userService.updateUser(id, req.body);
    res.json(updatedUser);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await userService.deleteUser(id);
    res.status(204).send();
});
