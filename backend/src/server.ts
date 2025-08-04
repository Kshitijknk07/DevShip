import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import apiRoutes from './routes/api';
import { setupSocket } from './sockets/index';
import { errorHandler } from './middleware/errorHandler';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/devship';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Basic route
app.get('/', (_req, res) => {
  res.send('DevShip Backend is running! 🚀');
});

// API routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
});

// Setup socket handlers
setupSocket(io);

server.listen(PORT, () => {
  console.log(`🚀 DevShip server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 API Info: http://localhost:${PORT}/api/info`);
});
