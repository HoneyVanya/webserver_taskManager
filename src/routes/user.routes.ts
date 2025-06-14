import { Router } from 'express';
import {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
} from '../controllers/user.controller.js';
import { validate } from '../middleware/validate.js';
import { createUserSchema, updateUserSchema } from '../schemas/user.schema.js';

const router = Router();

router.get('/', getAllUsers);
router.post('/', validate(createUserSchema), createUser);
router.put('/:id', validate(updateUserSchema), updateUser);
router.delete('/:id', deleteUser);

export default router;
