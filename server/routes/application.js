import {Router} from "express"
import { applicationController } from "../controllers/applicationController.js"
import { authenticate } from "../middleware/auth.js"

export const applicationRouter = Router()

applicationRouter.post("/",  authenticate, applicationController.createApplication)
applicationRouter.get("/my-applications", authenticate, applicationController.getUserApplications)