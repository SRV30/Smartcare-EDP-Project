import express from "express";
import { upsertBmi, getBmi } from "../controllers/bmiController.js";

const router = express.Router();

router.post("/save", upsertBmi);
router.get("/:userId", getBmi);

export default router;
