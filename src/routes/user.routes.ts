import { Router } from 'express';
import {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
} from '../controllers/user.controller.js';
import { validate } from '../middleware/validate.js';
import { createUserSchema, updateUserSchema } from '../schemas/user.schema.js';
import { verifyRecaptcha } from '../middleware/recaptcha.js';
import { verify } from 'crypto';

/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          properties:
 *              id:
 *                  type: string
 *                  description: The auto-generated id of the user.
 *              email:
 *                  type: string
 *                  format: email
 *                  description: The email of the user.
 *              username:
 *                  type: string
 *                  description: The username the user has chosen.
 *              createdAt:
 *                  type: string
 *                  format: date-time
 *                  description: The date the user was created.
 *              example:
 *                  id: "clw1..."
 *                  email: "test@mail.com"
 *                  username: "example"
 *                  createdAt: "2025-06-20T17:41:37.316Z"
 *
 * security:
 *  - bearerAuth: []
 */

const router = Router();

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: API for user management
 */

/**
 * @swagger
 * /users:
 *  get:
 *      summary: Retrieve a list of all users
 *      tags: [Users]
 *      responses:
 *          200:
 *              description: A list of users.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/User'
 *
 *
 *
 */

router.get('/', getAllUsers);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Register a new user.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *                  - email
 *                  - username
 *                  - password
 *             properties:
 *                  email:
 *                      type: string
 *                      format: email
 *                  username:
 *                      type: string
 *                  password:
 *                      type: string
 *                      format: password
 *
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       409:
 *          description: Conflict - A user with this email alreadt exists.
 */

router.post('/', verifyRecaptcha, validate(createUserSchema), createUser);
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user's details by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found.
 */
router.put('/:id', validate(updateUserSchema), updateUser);
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       204:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 */
router.delete('/:id', deleteUser);

export default router;
