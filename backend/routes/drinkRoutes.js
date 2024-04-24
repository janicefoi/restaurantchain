// routes/drinkRoutes.js
const express = require('express');
const router = express.Router();
const Drink = require('../models/Drink');

// Create a new drink
router.post('/drinks', async (req, res) => {
    try {
      const drink = await Drink.create(req.body); // Pass req.body directly
      res.status(201).json({ success: true, data: drink });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  });
  
// Get all drinks
router.get('/drinks', async (req, res) => {
  try {
    const drinks = await Drink.find();
    res.json({ success: true, data: drinks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get drink by ID
router.get('/drinks/:id', async (req, res) => {
  try {
    const drink = await Drink.findById(req.params.id);
    if (!drink) {
      return res.status(404).json({ success: false, error: 'Drink not found' });
    }
    res.json({ success: true, data: drink });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update drink by ID
router.put('/drinks/:id', async (req, res) => {
  try {
    const drink = await Drink.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!drink) {
      return res.status(404).json({ success: false, error: 'Drink not found' });
    }
    res.json({ success: true, data: drink });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete drink by ID
router.delete('/drinks/:id', async (req, res) => {
  try {
    const drink = await Drink.findByIdAndDelete(req.params.id);
    if (!drink) {
      return res.status(404).json({ success: false, error: 'Drink not found' });
    }
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get drinks by branch ID
router.get('/drinks/branch/:branchId', async (req, res) => {
    try {
      const drinks = await Drink.find({ branch: req.params.branchId });
      res.json({ success: true, data: drinks });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  })

module.exports = router;
