import {Router} from "express"
import { applicationController } from "../controllers/applicationController.js"
import { authenticate, optionalAuth } from "../middleware/auth.js"

export const applicationRouter = Router()

applicationRouter.post("/",  optionalAuth, applicationController.createApplication)
applicationRouter.get("/my-applications", authenticate, applicationController.getUserApplications)
applicationRouter.get("/all", authenticate, applicationController.getAllApplications)
applicationRouter.patch("/:id", authenticate, applicationController.updateApplication)