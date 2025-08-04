import { Router, Request, Response, NextFunction } from 'express';
import { Project } from '../models/Project';
import { auth, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all projects for user
router.get(
  '/',
  auth,
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const projects = await Project.find({
        $or: [{ owner: req.user._id }, { collaborators: req.user._id }],
      }).populate('owner', 'username email');

      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },
);

// Create new project
router.post(
  '/',
  auth,
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { title, description, language, files } = req.body;

      const project = new Project({
        title,
        description,
        language,
        files: files || [
          { name: 'main.js', content: '', language: 'javascript', path: '/' },
        ],
        owner: req.user._id,
      });

      await project.save();
      await project.populate('owner', 'username email');

      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },
);

// Get project by ID
router.get(
  '/:id',
  auth,
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const project = await Project.findById(req.params.id)
        .populate('owner', 'username email')
        .populate('collaborators', 'username email');

      if (!project) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      // Check if user has access
      if (
        !project.owner.equals(req.user._id) &&
        !project.collaborators.some((collab: any) =>
          collab._id.equals(req.user._id),
        )
      ) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      res.json(project);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },
);

// Update project
router.put(
  '/:id',
  auth,
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const project = await Project.findById(req.params.id);

      if (!project) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      // Check if user is owner
      if (!project.owner.equals(req.user._id)) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      const { title, description, language, files } = req.body;

      project.title = title || project.title;
      project.description = description || project.description;
      project.language = language || project.language;
      if (files) project.files = files;

      await project.save();
      await project.populate('owner', 'username email');

      res.json(project);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },
);

// Delete project
router.delete(
  '/:id',
  auth,
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const project = await Project.findById(req.params.id);

      if (!project) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      // Check if user is owner
      if (!project.owner.equals(req.user._id)) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      await project.deleteOne();
      res.json({ message: 'Project deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },
);

// Add collaborator
router.post(
  '/:id/collaborators',
  auth,
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email } = req.body;
      const project = await Project.findById(req.params.id);

      if (!project) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      // Check if user is owner
      if (!project.owner.equals(req.user._id)) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      // Find user by email
      const User = require('../models/User').User;
      const collaborator = await User.findOne({ email });

      if (!collaborator) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      if (project.collaborators.includes(collaborator._id)) {
        res.status(400).json({ error: 'User is already a collaborator' });
        return;
      }

      project.collaborators.push(collaborator._id);
      await project.save();
      await project.populate('collaborators', 'username email');

      res.json(project);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },
);

// Get project by share ID (public access)
router.get(
  '/share/:shareId',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const project = await Project.findOne({ shareId: req.params.shareId })
        .populate('owner', 'username email')
        .populate('collaborators', 'username email');

      if (!project) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      if (!project.isPublic) {
        res.status(403).json({ error: 'Project is private' });
        return;
      }

      res.json(project);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },
);

export default router;
