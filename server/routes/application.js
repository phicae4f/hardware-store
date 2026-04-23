import { Router } from "express";
import { applicationController } from "../controllers/applicationController.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";
import { detectRole } from "../middleware/detectRole.js";

export const applicationRouter = Router();

applicationRouter.post(
  "/",
  optionalAuth,
  applicationController.createApplication,
);
applicationRouter.get(
  "/my-applications",
  authenticate,
  applicationController.getUserApplications,
);
applicationRouter.get(
  "/all",
  authenticate,
  applicationController.getAllApplications,
);
applicationRouter.patch(
  "/:id",
  authenticate,
  applicationController.updateApplication,
);

applicationRouter.get(
  "/worker/my-applications",
  authenticate,
  detectRole("worker"),
  applicationController.getWorkerApplications,
);
applicationRouter.patch(
  "/:id/assign-worker",
  authenticate,
  detectRole("admin"),
  applicationController.assignWorker,
);
applicationRouter.get(
  "/:id/stages",
  authenticate,
  detectRole("worker"),
  applicationController.getProjectStages,
);
applicationRouter.patch(
  "/stages/:stageId",
  authenticate,
  detectRole("worker"),
  applicationController.updateStage,
);
applicationRouter.get(
  "/admin/dashboard",
  authenticate,
  detectRole("admin"),
  applicationController.getDashboardStats
);
