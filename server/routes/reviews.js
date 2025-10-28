import {Router} from "express"
import { authenticate } from "../middleware/auth.js"
import { reviewsController } from "../controllers/reviewsController.js"

export const reviewsRouter = Router()
reviewsRouter.post("/", authenticate, reviewsController.createReview)
reviewsRouter.get("/all", authenticate, reviewsController.fetchAllReviews)
reviewsRouter.get("/my-reviews", authenticate, reviewsController.fetchUserReviews)
reviewsRouter.patch("/:id/approve", authenticate, reviewsController.approveReview)
reviewsRouter.patch("/:id/reject", authenticate, reviewsController.rejectReview)
reviewsRouter.get("/approved", reviewsController.getApprovedReviews)