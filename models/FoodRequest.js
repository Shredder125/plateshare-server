import mongoose from 'mongoose';

const foodRequestSchema = new mongoose.Schema({
  // --- Link to the Food Item ---
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true,
  },

  // --- Details about the Food ---
  foodName: { type: String, required: true },
  foodImage: { type: String, required: true },
  donatorEmail: { type: String, required: true },
  pickupLocation: { type: String, required: true },

  // --- Details about the Requester ---
  requesterEmail: { type: String, required: true },
  requesterName: { type: String, required: true },
  requesterPhotoURL: { type: String },

  // --- Request Details ---
  location: { type: String, required: true },
  requestDate: {
    type: Date,
    default: Date.now,
  },
  reason: {
    type: String,
    required: [true, 'Reason for request is required.'],
  },
  contactNo: {
    type: String,
    required: [true, 'Contact number is required.'],
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'delivered', 'rejected'],
    default: 'pending',
  },
});

const FoodRequest = mongoose.model('FoodRequest', foodRequestSchema);

export default FoodRequest;