const Project = require('../models/Project.model');
const Activity = require('../models/Activity.model');
const User = require('../models/User.model');
const { sendInviteEmail } = require('../utils/email');

// @GET /api/projects
const getProjects = async (req, res, next) => {
  try {
    const query = req.user && req.user.role === 'admin'
      ? { isArchived: false }
      : { $or: [{ owner: req.user._id }, { 'members.user': req.user._id }], isArchived: false };

    const projects = await Project.find(query)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    res.json({ success: true, projects });
  } catch (err) { next(err); }
};

// @POST /api/projects
const createProject = async (req, res, next) => {
  try {
    const { name, description, color, icon } = req.body;
    const project = await Project.create({ name, description, color, icon, owner: req.user._id });
    await project.populate('owner', 'name email avatar');

    const io = req.app.get('io');
    io.emit('project:created', project);

    res.status(201).json({ success: true, project });
  } catch (err) { next(err); }
};

// @GET /api/projects/:id
const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, project });
  } catch (err) { next(err); }
};

// @PUT /api/projects/:id
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    
    // Log Activity
    await Activity.create({
      project: project._id,
      user: req.user._id,
      type: 'project_updated',
      message: `${req.user.name} updated project details`,
      details: req.body,
    });

    res.json({ success: true, project });
  } catch (err) { next(err); }
};

// @DELETE /api/projects/:id
const deleteProject = async (req, res, next) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) { next(err); }
};

// @POST /api/projects/:id/invite
const inviteMember = async (req, res, next) => {
  try {
    const { email, role = 'member' } = req.body;
    const invitee = await User.findOne({ email });
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const inviteLink = `${process.env.CLIENT_URL}/join/${project._id}?email=${email}`;

    if (invitee) {
      const alreadyMember = project.members.some((m) => m.user.toString() === invitee._id.toString());
      if (!alreadyMember) {
        project.members.push({ user: invitee._id, role });
        await project.save();
      }
    }

    await sendInviteEmail(email, req.user.name, project.name, inviteLink);

    // Log Activity
    await Activity.create({
      project: project._id,
      user: req.user._id,
      type: 'member_invited',
      message: `${req.user.name} invited ${email} as ${role}`,
    });

    res.json({ success: true, message: 'Invitation sent' });
  } catch (err) { next(err); }
};

module.exports = { getProjects, createProject, getProject, updateProject, deleteProject, inviteMember };
