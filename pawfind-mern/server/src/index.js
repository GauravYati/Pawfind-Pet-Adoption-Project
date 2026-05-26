import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import inquiryRoutes from "./routes/inquiries.js";
import petRoutes from "./routes/pets.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pawfind";

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "pawfind-api",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

app.use("/api/pets", petRoutes);
app.use("/api/inquiries", inquiryRoutes);

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});

mongoose
  .connect(mongoUri, { serverSelectionTimeoutMS: 3000 })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("Could not connect to MongoDB:", error.message);
  });
