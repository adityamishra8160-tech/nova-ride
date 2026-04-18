// =============================================
// Cars Routes
// =============================================
const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const { protect, adminOnly } = require('../middleware/auth');

// ---- GET /api/cars - Get all cars (public) ----
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---- GET /api/cars/:id - Get single car ----
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---- POST /api/cars - Admin: Add a new car ----
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, pricePerKm, availability, image, category } = req.body;
    const car = await Car.create({ name, pricePerKm, availability, image, category });
    res.status(201).json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---- DELETE /api/cars/:id - Admin: Delete a car ----
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.json({ message: 'Car deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
