import express from "express";
const router = express.Router();
import HealthData from "../models/HealthData.js";

router.post("/", async (req, res) => {
  try {
    const { heartRate, spo2 } = req.body;

    if (!heartRate || !spo2) {
      return res.status(400).json({ error: "heartRate and spo2 required" });
    }

    const newData = new HealthData({ heartRate, spo2 });
    await newData.save();

    res.status(201).json({ message: "✅ Data saved", data: newData });
  } catch (error) {
    console.error("❌ Failed to save:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
