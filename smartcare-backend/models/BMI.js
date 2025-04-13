import mongoose from "mongoose";

const bmiSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    height: {
      type: Number, // in cm
      required: true,
    },
    weight: {
      type: Number, // in kg
      required: true,
    },
  },
  { timestamps: true }
);

const Bmi = mongoose.model("Bmi", bmiSchema);
export default Bmi;
