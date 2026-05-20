const express = require('express');
const router = express.Router();
const {
  getProjects, createProject, getProject, updateProject, deleteProject, inviteMember
} = require('../controllers/project.controller');
const { protect } = require('../middleware/auth.middleware');
const { requireProjectAdmin } = require('../middleware/role.middleware');

router.use(protect);

router.route('/').get(getProjects).post(createProject);
router.route('/:id').get(getProject).put(requireProjectAdmin, updateProject).delete(requireProjectAdmin, deleteProject);
router.post('/:id/invite', requireProjectAdmin, inviteMember);

module.exports = router;
