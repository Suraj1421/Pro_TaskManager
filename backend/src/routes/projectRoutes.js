import { Router } from 'express';
import {
  listProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  updateMember,
  removeMember,
} from '../controllers/projectController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import {
  createProjectSchema,
  updateProjectSchema,
  addMemberSchema,
  updateMemberSchema,
} from '../validators/projectSchemas.js';
import { loadProject, requireProjectMember, requireProjectRole } from '../middleware/projectAccess.js';

const router = Router();

router.use(protect);

router.get('/', listProjects);
router.post('/', validate(createProjectSchema), createProject);

router.get('/:id', loadProject, requireProjectMember, getProject);
router.patch(
  '/:id',
  loadProject,
  requireProjectRole('owner', 'admin'),
  validate(updateProjectSchema),
  updateProject
);
router.delete('/:id', loadProject, requireProjectRole('owner'), deleteProject);

router.post(
  '/:id/members',
  loadProject,
  requireProjectRole('owner', 'admin'),
  validate(addMemberSchema),
  addMember
);
router.patch(
  '/:id/members/:memberId',
  loadProject,
  requireProjectRole('owner', 'admin'),
  validate(updateMemberSchema),
  updateMember
);
router.delete(
  '/:id/members/:memberId',
  loadProject,
  requireProjectRole('owner', 'admin'),
  removeMember
);

export default router;
