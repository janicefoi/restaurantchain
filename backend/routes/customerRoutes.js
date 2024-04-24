// backend/routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// Define routes for CRUD operations on customers

// Create a new customer
router.post('/customers', async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json({ success: true, data: customer });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Get all customers
router.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json({ success: true, data: customers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get a single customer by ID
router.get('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }
    res.json({ success: true, data: customer });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update a customer by ID
router.put('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }
    res.json({ success: true, data: customer });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Delete a customer by ID
router.delete('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
// Customer login endpoint
router.post('/customers/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if customer credentials are valid
    const customer = await Customer.findOne({ email, password });
    if (!customer) {
      return res.status(404).send({ error: "Invalid credentials" });
    }
    // Send success response
    res.send({ message: "Login successful", customer });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
