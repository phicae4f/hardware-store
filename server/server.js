import "dotenv/config";
import express from "express";
import cors from "cors";
import { createTables } from "./db.js";
import { userRouter } from "./routes/user.js";
import { workersRoute } from "./routes/workers.js";
import { applicationRouter } from "./routes/application.js";
import { reviewsRouter } from "./routes/reviews.js";
import { projectsRouter } from "./routes/projects.js";


const PORT = process.env.PORT
const app = express()

app.use(cors({
    origin: process.env.ORIGIN_PORT,
    credentials: true
}))

app.use(express.json())
createTables()

app.use("/api/auth", userRouter)
app.use("/api/worker-auth", workersRoute)
app.use("/api/applications", applicationRouter)
app.use("/api/reviews", reviewsRouter)
app.use("/api/projects", projectsRouter)


app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})