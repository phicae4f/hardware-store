import "dotenv/config";
import express from "express";
import cors from "cors";
import { createTables } from "./db.js";


const PORT = process.env.PORT
const app = express()

app.use(cors({
    origin: process.env.ORIGIN_PORT,
    credentials: true
}))

app.use(express.json())
createTables()

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})