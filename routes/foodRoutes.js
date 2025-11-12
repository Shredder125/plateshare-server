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

// Get a single food by ID (safe)
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid food ID format" });
  }

  try {
    // Try direct findById first
    let food = await Food.findById(id);

    // Fallback: fetch all and find manually (handles legacy/mismatch)
    if (!food) {
      const allFoods = await Food.find();
      food = allFoods.find(f => f._id.toString() === id);
    }

    if (!food) return res.status(404).json({ message: "Food not found" });

    res.json(food);
  } catch (err) {
    console.error("Error fetching food by ID:", err);
    res.status(500).json({ message: "Error fetching food" });
  }
});

// Add a new food
router.post("/", async (req, res) => {
  try {
    const {
      foodName,
      foodImage,
      foodQuantity,
      pickupLocation,
      expireDate,
      additionalNotes,
      food_status,
      donatorName,
      donatorEmail,
      donatorImage,
    } = req.body;

    if (!foodName || !foodQuantity || !pickupLocation || !expireDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newFood = new Food({
      foodName,
      foodImage,
      foodQuantity,
      pickupLocation,
      expireDate,
      additionalNotes,
      food_status: food_status || "Available",
      donatorName,
      donatorEmail,
      donatorImage,
    });

    const savedFood = await newFood.save();
    res.status(201).json(savedFood);
  } catch (err) {
    console.error("Error adding food:", err);
    res.status(500).json({ message: "Failed to add food", error: err.message });
  }
});

export default router;
