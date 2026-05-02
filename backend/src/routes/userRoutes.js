import { Router } from 'express';
import { listUsers, getUser, updateUser, deleteUser } from '../controllers/userController.js';
import { protect, requireUserRole } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { userIdParamSchema, updateUserSchema } from '../validators/userSchemas.js';

const router = Router();

router.use(protect);

router.get('/', requireUserRole('admin'), listUsers);
router.get('/:id', validate(userIdParamSchema), getUser);
router.patch('/:id', validate(updateUserSchema), updateUser);
router.delete('/:id', validate(userIdParamSchema), deleteUser);

export default router;
