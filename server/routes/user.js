import { Router } from "express"
import { userController } from "../controllers/userController.js"

export const userRouter = Router()

userRouter.post("/register", userController.register)
userRouter.post("/login", userController.login)
