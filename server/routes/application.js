import {Router} from "express"
import { applicationController } from "../controllers/applicationController.js"

export const applicationRouter = Router()

applicationRouter.post("/", applicationController.createApplication)