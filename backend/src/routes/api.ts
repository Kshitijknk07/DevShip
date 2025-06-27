import { Router } from "express";

const router = Router();

router.get("/info", (_req, res) => {
  res.json({
    project: "DevShip",
    status: "Production Ready!",
    time: new Date().toISOString(),
  });
});

export default router;
