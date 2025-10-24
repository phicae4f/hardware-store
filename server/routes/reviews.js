import {Router} from "express"
import { authenticate } from "../middleware/auth.js"
import { reviewsController } from "../controllers/reviewsController.js"

export const reviewsRouter = Router()
reviewsRouter.post("/", authenticate, reviewsController.createReview)