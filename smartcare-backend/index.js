import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import connectDB from "./config/connectDB.js";
dotenv.config();

process.on("uncaughtException", (err) => {
  console.error(`Error: ${err.message}`);
  console.error(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ["https://smartcare-xi.vercel.app", "http://localhost:5173"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running: " + PORT);
});

//routes
import dataRoute from "./route/data.js";
import authRoute from "./route/authRoutes.js";
import healthRoute from "./route/healthSimulate.js";
import linkingRoute from "./route/linkingRoutes.js";

app.use("/api/data", dataRoute);
app.use("/api/auth", authRoute);
app.get("/api/health-data", (req, res) => {
  const dummyData = {
    heartRate: Math.floor(Math.random() * (85 - 63 + 1)) + 60, // 60–110 bpm
    spo2: Math.floor(Math.random() * (97 - 90 + 1)) + 90,       // 90–100%
    temperature: (36 + Math.random() * 2).toFixed(1)             // 36.0–38.0 °C
  };
  res.json(dummyData);
});
app.use("/api/health", healthRoute);
app.use("/api/link", linkingRoute);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});

process.on("unhandledRejection", (err) => {
  console.error(`Error: ${err.message}`);
  console.error(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
