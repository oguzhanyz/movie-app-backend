import express from "express";
import { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import { logger } from "./middleware/logger";
import authRoutes from "./routes/auth";
import apiRoutes from "./routes/api";

dotenv.config();

const app = express();

connectDB();

app.use(logger);

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

app.get("/*", (req: Request, res: Response) => {
  res.status(404).send();
});

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
