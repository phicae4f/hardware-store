import "dotenv/config";
import express from "express";
import cors from "cors";
import { createTables } from "./db.js";
import { userRouter } from "./routes/user.js";
import { applicationRouter } from "./routes/application.js";
import { reviewsRouter } from "./routes/reviews.js";
import { projectsRouter } from "./routes/projects.js";
import path from 'path';


const PORT = process.env.PORT
const app = express()

app.use(cors({
    origin: process.env.ORIGIN_PORT,
    credentials: true
}))

app.use(express.json())
createTables()

app.use("/api/auth", userRouter)
app.use("/api/applications", applicationRouter)
app.use("/api/reviews", reviewsRouter)
app.use("/api/projects", projectsRouter)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})