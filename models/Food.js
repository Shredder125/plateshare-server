import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    foodName: { type: String, required: true },
    foodImage: { type: String, default: "https://via.placeholder.com/600x400" },
    foodQuantity: { type: String, required: true },
    donatorName: { type: String, default: "Anonymous" },
    donatorEmail: { type: String }, // optional, useful for donor contact
    donatorImage: { type: String }, // optional
    pickupLocation: { type: String, default: "N/A" },
    expireDate: { type: Date },
    additionalNotes: { type: String, default: "None" },
    food_status: { type: String, default: "Available" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: "platesharefoodz",
  }
);

// Indexes
foodSchema.index({ createdAt: -1 });
foodSchema.index({ food_status: 1 });

export default mongoose.model("Food", foodSchema);
