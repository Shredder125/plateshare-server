import express from "express";
import mongoose from "mongoose";
import Food from "../models/Food.js";

const router = express.Router();

// Featured foods (latest 6)
router.get("/featured", async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 }).limit(6);
    res.json(foods);
  } catch (err) {
    console.error("Error fetching featured foods:", err);
    res.status(500).json({ message: "Error fetching featured foods" });
  }
});

// Get all foods
router.get("/", async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });
    res.json(foods);
  } catch (err) {
    console.error("Error fetching all foods:", err);
    res.status(500).json({ message: "Error fetching foods" });
  }
});

// Get a single food by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  // Validate MongoDB ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid food ID format" });
  }

  try {
    // Fetch all foods and find matching ID
    // This approach works when direct findById fails due to schema/collection issues
    const allFoods = await Food.find();
    const food = allFoods.find(f => f._id.toString() === id);
    
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }
    
    res.json(food);
  } catch (err) {
    console.error("Error fetching food by ID:", err);
    res.status(500).json({ message: "Error fetching food" });
  }
});

export default router;