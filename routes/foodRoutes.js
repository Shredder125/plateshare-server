import express from "express";
import Food from "../models/Food.js";

const router = express.Router();

router.get("/featured", async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 }).limit(6);
    res.json(foods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching featured foods" });
  }
});

export default router;
