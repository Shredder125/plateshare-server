import express from 'express';
import mongoose from 'mongoose';
import FoodRequest from '../models/FoodRequest.js';
import Food from '../models/Food.js';

const router = express.Router();

router.get('/:foodId', async (req, res) => {
  try {
    const { foodId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(foodId)) {
      return res.status(400).json({ message: 'Invalid food ID' });
    }

    const requests = await FoodRequest.find({ foodId: new mongoose.Types.ObjectId(foodId) });
    
    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error.message);
    res.status(500).json({ message: 'Error fetching requests' });
  }
});

router.put('/:requestId/accept', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { foodId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ message: 'Invalid request ID' });
    }

    const foodRequest = await FoodRequest.findByIdAndUpdate(
      requestId,
      { status: 'accepted' },
      { new: true }
    );

    if (!foodRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (foodId && mongoose.Types.ObjectId.isValid(foodId)) {
      await Food.findByIdAndUpdate(
        foodId,
        { food_status: 'Donated' },
        { new: true }
      );
    }

    res.json({ message: 'Request accepted', data: foodRequest });
  } catch (error) {
    console.error('Error accepting request:', error.message);
    res.status(500).json({ message: 'Error accepting request' });
  }
});

router.put('/:requestId/reject', async (req, res) => {
  try {
    const { requestId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ message: 'Invalid request ID' });
    }

    const foodRequest = await FoodRequest.findByIdAndUpdate(
      requestId,
      { status: 'Rejected' },
      { new: true }
    );

    if (!foodRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ message: 'Request rejected', data: foodRequest });
  } catch (error) {
    console.error('Error rejecting request:', error.message);
    res.status(500).json({ message: 'Error rejecting request' });
  }
});

export default router;