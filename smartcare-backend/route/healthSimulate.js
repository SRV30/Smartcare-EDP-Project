import express from "express";
import HealthData from "../models/HealthData.js";
const router = express.Router();

const getRandomValue = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

let healthSimulationInterval = null;

const simulateAndSave = async (userId) => {
  try {
    let stream = [];
    let heartRates = [],
      spo2s = [],
      temperatures = [];

    for (let i = 0; i < 9; i++) {
      const heartRate = getRandomValue(60, 100);
      const spo2 = getRandomValue(90, 100);
      const temperature = (Math.random() * (37.5 - 36.0) + 36.0).toFixed(1);

      const timestamp = new Date();

      heartRates.push(heartRate);
      spo2s.push(spo2);
      temperatures.push(temperature);

      stream.push({ heartRate, spo2, temperature, timestamp });

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const avg = (arr) =>
      arr.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / arr.length;

    const average = {
      heartRate: Math.round(avg(heartRates)),
      spo2: Math.round(avg(spo2s)),
      temperature: avg(temperatures).toFixed(1),
    };

    await HealthData.deleteMany({ user: userId });

    const healthData = new HealthData({
      user: userId,
      heartRate: average.heartRate,
      spo2: average.spo2,
      temperature: average.temperature,
      stream,
    });

    await healthData.save();
    return { stream, average };
  } catch (err) {
    console.error("❌ Simulation Error:", err);
    throw err;
  }
};

router.post("/simulate", async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ msg: "User ID is required" });

  try {
    const result = await simulateAndSave(userId);
    res.status(200).json({
      msg: "Simulation complete ✅",
      ...result,
    });
  } catch {
    res.status(500).json({ msg: "Server Error" });
  }
});

router.post("/simulate/start", (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ msg: "User ID is required" });

  if (healthSimulationInterval) {
    clearInterval(healthSimulationInterval);
  }

  simulateAndSave(userId);

  healthSimulationInterval = setInterval(() => {
    simulateAndSave(userId);
  }, 60 * 1000);

  res.json({ msg: "Auto simulation started 🔁 every 1 min" });
});

router.post("/simulate/stop", (req, res) => {
  if (healthSimulationInterval) {
    clearInterval(healthSimulationInterval);
    healthSimulationInterval = null;
    return res.json({ msg: "Simulation stopped ⛔" });
  } else {
    return res.status(400).json({ msg: "No simulation running" });
  }
});

// GET latest health data for a user
router.get("/latest/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const data = await HealthData.findOne({ user: userId }).sort({ _id: -1 });
    if (!data) return res.status(404).json({ msg: "No health data found" });
    res.json(data);
  } catch (err) {
    console.error("❌ Fetch Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
