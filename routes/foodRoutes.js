import express from "express";
import mongoose from "mongoose";
import Food from "../models/Food.js";

const router = express.Router();

router.get("/featured", async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 }).limit(6);
    res.json(foods);
  } catch (err) {
    console.error("Error fetching featured foods:", err);
    res.status(500).json({ message: "Error fetching featured foods" });
  }
});

router.get("/", async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });
    res.json(foods);
  } catch (err) {
    console.error("Error fetching all foods:", err);
    res.status(500).json({ message: "Error fetching foods" });
  }
});

router.get("/donator/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const foods = await Food.find({ donatorEmail: email }).sort({ createdAt: -1 });
    res.json(foods);
  } catch (err) {
    console.error("Error fetching user foods:", err);
    res.status(500).json({ message: "Error fetching foods for user" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid food ID format" });

  try {
    let food = await Food.findById(id);
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

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

  try {
    const updatedFood = await Food.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedFood) return res.status(404).json({ message: "Food not found" });
    res.json(updatedFood);
  } catch (err) {
    console.error("Error updating food:", err);
    res.status(500).json({ message: "Failed to update food", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

  try {
    const deletedFood = await Food.findByIdAndDelete(id);
    if (!deletedFood) return res.status(404).json({ message: "Food not found" });
    res.json({ message: "Food deleted successfully" });
  } catch (err) {
    console.error("Error deleting food:", err);
    res.status(500).json({ message: "Failed to delete food", error: err.message });
  }
});

export default router;
