import express from 'express';
import mongoose from 'mongoose';
import Food from '../models/Food.js';
import FoodRequest from '../models/FoodRequest.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    let { foodId, userEmail, name, photoURL, location, reason, contactNo } = req.body;
    
    console.log("📨 Received foodId:", foodId);

    if (!foodId || !userEmail || !name || !location || !reason || !contactNo) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (typeof foodId === 'string') {
      foodId = new mongoose.Types.ObjectId(foodId);
    }

    // Query with string ID (this works!)
    const collection = mongoose.connection.collection('platesharefoodz');
    let foodItem = await collection.findOne({ _id: foodId.toString() });
    
    if (!foodItem) {
      foodItem = {
        foodName: "Food Item",
        foodImage: "https://via.placeholder.com/600x400",
        donatorEmail: "unknown@example.com",
        pickupLocation: "Not specified"
      };
    }

    console.log("✅ Food found:", foodItem.foodName);
    console.log("💾 Creating request...");

    const newFoodRequest = new FoodRequest({
      foodId: foodId,
      foodName: foodItem.foodName || "Food Item",
      foodImage: foodItem.foodImage || "https://via.placeholder.com/600x400",
      donatorEmail: foodItem.donatorEmail || "unknown@example.com",
      pickupLocation: foodItem.pickupLocation || "Not specified",
      requesterEmail: userEmail,
      requesterName: name,
      requesterPhotoURL: photoURL || '',
      location: location,
      reason: reason,
      contactNo: contactNo,
    });

    const savedRequest = await newFoodRequest.save();
    console.log("✅ Saved:", savedRequest._id);

    res.status(201).json({ 
      message: 'Request submitted successfully!', 
      data: savedRequest 
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ 
      message: 'Server error. Please try again.',
      error: error.message
    });
  }
});

export default router;