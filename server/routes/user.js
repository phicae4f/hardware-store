import { Router } from "express"
import { userController } from "../controllers/userController.js"
import { authenticate } from "../middleware/auth.js"


export const userRouter = Router()

userRouter.post("/register", userController.register)
userRouter.post("/login", userController.login)
userRouter.post("/change-worker-password", authenticate, userController.changeWorkerPassword)
