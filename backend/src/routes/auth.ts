import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { auth, AuthRequest } from '../middleware/auth';

const router = Router();

// Register user
router.post(
  '/register',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { username, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });
      if (existingUser) {
        res.status(400).json({ error: 'User already exists' });
        return;
      }

      // Create new user
      const user = new User({
        username,
        email,
        password,
      });

      await user.save();

      // Generate JWT token
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        res.status(500).json({ error: 'JWT secret not configured' });
        return;
      }

      const token = jwt.sign(
        { userId: user._id },
        jwtSecret,
        { expiresIn: '7d' },
      );

      res.status(201).json({
        message: 'User created successfully',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },
);

// Login user
router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ error: 'Invalid credentials' });
        return;
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(400).json({ error: 'Invalid credentials' });
        return;
      }

      // Generate JWT token
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        res.status(500).json({ error: 'JWT secret not configured' });
        return;
      }

      const token = jwt.sign(
        { userId: user._id },
        jwtSecret,
        { expiresIn: '7d' },
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },
);

// Get current user
router.get(
  '/me',
  auth,
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      res.json({
        user: {
          id: req.user._id,
          username: req.user.username,
          email: req.user.email,
          avatar: req.user.avatar,
          bio: req.user.bio,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },
);

export default router;
