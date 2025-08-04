import { Router } from "express";
import authRoutes from "./auth";
import projectRoutes from "./projects";

const router = Router();

// Health check
router.get("/info", (_req, res) => {
  res.json({
    project: "DevShip",
    status: "Production Ready!",
    time: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Health check endpoint
router.get("/health", (_req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// Mount route modules
router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);

export default router;
