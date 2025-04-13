import Bmi from "../models/BMI.js";

// Save or Update BMI data
export const upsertBmi = async (req, res) => {
  const { userId, height, weight } = req.body;

  if (!userId || !height || !weight) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let bmi = await Bmi.findOne({ userId });

    if (bmi) {
      bmi.height = height;
      bmi.weight = weight;
      await bmi.save();
      return res.status(200).json({ message: "BMI updated", bmi });
    }

    bmi = new Bmi({ userId, height, weight });
    await bmi.save();
    res.status(201).json({ message: "BMI saved", bmi });
  } catch (err) {
    console.error("Error in upsertBmi:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get BMI data
export const getBmi = async (req, res) => {
  try {
    const userId =
      req.user && req.user.id
        ? req.user.id
        : req.params.userId || req.body.userId;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const bmi = await Bmi.findOne({ userId });

    if (!bmi) {
      return res.status(404).json({ error: "BMI data not found" });
    }

    res.status(200).json(bmi);
  } catch (err) {
    console.error("Error in getBmi:", err);
    res.status(500).json({ error: "Server error" });
  }
};
