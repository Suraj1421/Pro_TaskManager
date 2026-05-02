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
  projectIdParamSchema,
  addMemberSchema,
  updateMemberSchema,
} from '../validators/projectSchemas.js';
import { loadProject, requireProjectMember, requireProjectRole } from '../middleware/projectAccess.js';

const router = Router();

router.use(protect);

router.get('/', listProjects);
router.post('/', validate(createProjectSchema), createProject);

router.get('/:id', validate(projectIdParamSchema), loadProject, requireProjectMember, getProject);
router.patch(
  '/:id',
  validate(updateProjectSchema),
  loadProject,
  requireProjectRole('owner', 'admin'),
  updateProject
);
router.delete(
  '/:id',
  validate(projectIdParamSchema),
  loadProject,
  requireProjectRole('owner'),
  deleteProject
);

router.post(
  '/:id/members',
  validate(addMemberSchema),
  loadProject,
  requireProjectRole('owner', 'admin'),
  addMember
);
router.patch(
  '/:id/members/:memberId',
  validate(updateMemberSchema),
  loadProject,
  requireProjectRole('owner', 'admin'),
  updateMember
);
router.delete(
  '/:id/members/:memberId',
  loadProject,
  requireProjectRole('owner', 'admin'),
  removeMember
);

export default router;
