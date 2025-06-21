/**
 * @swagger
 * components:
 *  schemas:
 *      Task:
 *          type: object
 *          required:
 *              - id
 *              - title
 *              - completed
 *              - authorId
 *          properties:
 *              id:
 *                  type: string
 *                  description: The title of your task.
 *              title:
 *                  type: string
 *                  description: The title of your task.
 *              completed:
 *                  type: booolean
 *                  description: Whether the task is completed or not.
 *              authorId:
 *                  type: string
 *                  description: The ID of the user who owns the task.
 *              createdAt:
 *                  type: string
 *                  format: date-time
 *                  description: The data the user was added.
 *              example:
 *                  id: "clw1..."
 *                  title: "Learn swagger"
 *                  completed: "false"
 *                  authorId: "clw2..."
 *                  createdAt: "2025-06-20T17:41:37.316Z"
 *
 * security:
 *  - bearerAuth: []
 */

import { Router } from 'express';
import {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
} from '../controllers/task.controller.js';
import { validate } from '../middleware/validate.js';
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schema.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *  name: Tasks
 *  description: API for managing user tasks
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Retrieve a list of all tasks for the logged-in user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of tasks.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */

router.get('/', getAllTasks);
/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task for the logged-in user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */
router.post('/', validate(createTaskSchema), createTask);
/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a specific task by its ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: The updated task.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found.
 */
router.put('/:id', validate(updateTaskSchema), updateTask);
/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task by its ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task ID
 *     responses:
 *       204:
 *         description: Task deleted successfully.
 *       404:
 *         description: Task not found.
 */
router.delete('/:id', deleteTask);

export default router;
