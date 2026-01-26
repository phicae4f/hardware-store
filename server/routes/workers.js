import {Router} from "express"
import { workerController } from "../controllers/workerController.js"

export const workersRoute = Router()

workersRoute.post("/register", workerController.register)
workersRoute.post("/login", workerController.login)