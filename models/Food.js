import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  foodName: { type: String, required: true },
  foodImage: String,
  foodQuantity: String,
  pickupLocation: String,
  expireDate: Date,
  additionalNotes: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Food", foodSchema);
