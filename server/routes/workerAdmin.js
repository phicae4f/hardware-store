import { Router } from "express"
import { workerAdminController } from "../controllers/workerAdminController.js"
import { authenticate } from "../middleware/auth.js"
import { detectRole } from "../middleware/detectRole.js"

export const workerAdminRouter = Router()

workerAdminRouter.use(authenticate, detectRole("admin"))

workerAdminRouter.post("/create-worker", workerAdminController.createWorker)