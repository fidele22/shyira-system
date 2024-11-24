// routes/carRoutes.js
const express = require('express');
const Car = require('../models/carData');
const router = express.Router();

// Get all cars
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new car entry
router.post('/save-data', async (req, res) => {
  const { registerNumber, kilometersCovered,remainingLiters } = req.body;

  const car = new Car({
    registerNumber,
    kilometersCovered,
    remainingLiters
  });

  try {
    const newCar = await car.save();
    res.status(201).json(newCar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;