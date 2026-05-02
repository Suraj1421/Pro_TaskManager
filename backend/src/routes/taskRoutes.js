import { Router } from 'express';
import {
  listTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';
import { loadProject, requireProjectMember } from '../middleware/projectAccess.js';
import validate from '../middleware/validate.js';
import { createTaskSchema, updateTaskSchema } from '../validators/taskSchemas.js';

const router = Router({ mergeParams: true });

router.use(protect, loadProject, requireProjectMember);

router.get('/', listTasks);
router.post('/', validate(createTaskSchema), createTask);
router.get('/:taskId', getTask);
router.patch('/:taskId', validate(updateTaskSchema), updateTask);
router.delete('/:taskId', deleteTask);

export default router;
