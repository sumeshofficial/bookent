import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT;
const app = express();

await connectDB();

// Middleware

app.use(express.json());
app.use(cors());

app.get("/api");

app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});