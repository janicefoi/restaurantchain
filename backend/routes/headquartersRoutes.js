// backend/routes/headquartersRoutes.js
const express = require('express');
const router = express.Router();
const Headquarters = require('../models/Headquarters');
const Branch = require('../models/Branch');

// Create a new headquarters
router.post('/headquarters', async (req, res) => {
  try {
    const headquarters = new Headquarters(req.body);
    await headquarters.save();
    res.status(201).send(headquarters);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all headquarters
router.get('/headquarters', async (req, res) => {
  try {
    const headquarters = await Headquarters.find();
    res.send(headquarters);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a single headquarters by ID
router.get('/headquarters/:id', async (req, res) => {
  try {
    const headquarters = await Headquarters.findById(req.params.id);
    if (!headquarters) {
      return res.status(404).send();
    }
    res.send(headquarters);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a headquarters by ID
router.patch('/headquarters/:id', async (req, res) => {
  try {
    const headquarters = await Headquarters.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!headquarters) {
      return res.status(404).send();
    }
    res.send(headquarters);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a headquarters by ID
router.delete('/headquarters/:id', async (req, res) => {
  try {
    const headquarters = await Headquarters.findByIdAndDelete(req.params.id);
    if (!headquarters) {
      return res.status(404).send();
    }
    res.send(headquarters);
  } catch (error) {
    res.status(500).send(error);
  }
});


// Login endpoint for headquarters
router.post('/headquarters/login', async (req, res) => {
  const { name, password } = req.body;
  try {
    const headquarters = await Headquarters.findOne({ name, password });
    if (!headquarters) {
      return res.status(404).send({ error: "Invalid credentials" });
    }
    res.send({ message: "Login successful", headquarters });
  } catch (error) {
    res.status(500).send(error);
  }
});


// Route to calculate total sales
router.get('/total-sales', async (req, res) => {
  try {
    // Fetch all branches from the database
    const branches = await Branch.find({});
    
    // Sum up the sales of all branches
    const totalSales = branches.reduce((total, branch) => total + branch.sales, 0);

    // Return the total sales as a response
    res.json({ totalSales });
  } catch (error) {
    console.error('Error calculating total sales:', error);
    res.status(500).json({ error: 'Error calculating total sales' });
  }
});
// Route to calculate total profits of all branches
router.get('/total-profits', async (req, res) => {
  try {
    const branches = await Branch.find({});
    let totalProfits = 0;
    branches.forEach(branch => {
      totalProfits += branch.profits;
    });
    res.json({ totalProfits });
  } catch (error) {
    console.error('Error fetching total profits:', error);
    res.status(500).json({ error: 'Error fetching total profits' });
  }
});
module.exports = router;

