import mongoose from "mongoose";

const healthDataSchema = new mongoose.Schema({
  heartRate: {
    type: Number,
    required: true,
  },
  spo2: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const HealthData = mongoose.model("HealthData", healthDataSchema);
export default HealthData;
