// =============================================
// Bookings Routes
// =============================================
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');

// ---- POST /api/bookings - Create a booking ----
router.post('/', protect, async (req, res) => {
  try {
    const { carId, pickup, drop, date, distance, amount } = req.body;

    const booking = await Booking.create({
      userId: req.user.id,
      carId,
      pickup,
      drop,
      date,
      distance,
      amount,
      paymentStatus: 'pending',
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---- GET /api/bookings/my - Get logged-in user's bookings ----
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('carId', 'name image pricePerKm')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---- PATCH /api/bookings/:id/pay - Mark booking as paid ----
router.patch('/:id/pay', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Ensure user owns this booking
    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.paymentStatus = 'paid';
    await booking.save();

    res.json({ message: 'Payment successful', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
