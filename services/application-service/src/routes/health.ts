import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.json({
    service: "application-service",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});
