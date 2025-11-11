import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  foodName: { type: String, required: true },
  foodImage: { type: String, default: "https://via.placeholder.com/600x400" },
  foodQuantity: { type: String, required: true },
  donatorName: { type: String, default: "Anonymous" },
  pickupLocation: { type: String, default: "N/A" },
  expireDate: Date,
  additionalNotes: { type: String, default: "None" },
  food_status: { type: String, default: "Available" },
  createdAt: { type: Date, default: Date.now },
}, {
  collection: "platesharefoodz" // Explicitly specify collection name
});

// Create indexes for better query performance
foodSchema.index({ createdAt: -1 });
foodSchema.index({ food_status: 1 });

export default mongoose.model("Food", foodSchema);