// models/HealthData.js
import mongoose from "mongoose";

const streamSchema = new mongoose.Schema({
  heartRate: Number,
  spo2: Number,
  temperature: Number,
  timestamp: Date,
});

const HealthDataSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  heartRate: Number,
  spo2: Number,
  temperature: Number,
  stream: [streamSchema], // 💾 10-sec stream
});

export default mongoose.model("HealthData", HealthDataSchema);
