// backend/routes/branchRoutes.js
const express = require('express');
const router = express.Router();
const Branch = require('../models/Branch');
const Order = require('../models/Order');
const Drink = require('../models/Drink');
const mongoose = require('mongoose'); // Import mongoose

// Create a new branch
router.post('/branches', async (req, res) => {
  try {
    const branch = new Branch(req.body);
    await branch.save();
    res.status(201).send(branch);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all branches
router.get('/branches', async (req, res) => {
  try {
    const branches = await Branch.find();
    res.send(branches);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a single branch by ID
router.get('/branches/:id', async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) {
      return res.status(404).send();
    }
    res.send(branch);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a branch by ID
router.patch('/branches/:id', async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!branch) {
      return res.status(404).send();
    }
    res.send(branch);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a branch by ID
router.delete('/branches/:id', async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) {
      return res.status(404).send();
    }
    res.send(branch);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Branch login endpoint
router.post('/branches/login', async (req, res) => {
  const { name, password } = req.body;
  try {
    // Check if branch credentials are valid
    const branch = await Branch.findOne({ name, password });
    if (!branch) {
      return res.status(404).send({ error: "Invalid credentials" });
    }
    // Send success response
    res.send({ message: "Login successful", branch });
  } catch (error) {
    res.status(500).send(error);
  }
});
// Get a single branch by name
router.get('/branches/name/:name', async (req, res) => {
  try {
    const branch = await Branch.findOne({ name: req.params.name });
    if (!branch) {
      return res.status(404).send({ error: 'Branch not found' });
    }
    res.send({ _id: branch._id });
  } catch (error) {
    console.error('Error fetching branch by name:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const { ObjectId } = require('mongodb'); // Ensure ObjectId is properly imported

router.get('/branch-sales/:branchId', async (req, res) => {
  const { branchId } = req.params;

  try {
    // Convert branchId to ObjectId
    const objectIdBranchId = new ObjectId(branchId);

    // Find all orders with status "delivered" that belong to the specified branch
    const totalSales = await Order.aggregate([
      {
        $match: {
          branch: objectIdBranchId, // Use the converted branchId
          status: 'delivered'
        }
      },
      {
        $group: {
          _id: '$branch', // Group by branch
          totalSales: { $sum: '$totalPrice' } // Sum totalPrice for each branch
        }
      }
    ]);

    // Extract totalSalesAmount from the result (if any)
    const totalSalesAmount = totalSales.length > 0 ? totalSales[0].totalSales : 0;

    // Update the sales field in the Branch model
    await Branch.findByIdAndUpdate(branchId, { sales: totalSalesAmount });

    // Send the total sales as a response
    res.json({ totalSales: totalSalesAmount });
  } catch (error) {
    console.error('Error fetching branch sales:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/branch-profits/:branchId', async (req, res) => {
  const { branchId } = req.params;

  try {
    // Find all orders with status "delivered" that belong to the specified branch
    const orders = await Order.find({ branch: branchId, status: 'delivered' });

    // Calculate total profits from the orders
    let totalProfits = 0;
    for (const order of orders) {
      for (const drink of order.drinks) {
        const drinkDetails = await Drink.findById(drink.drink);
        totalProfits += drinkDetails.profits * drink.quantity;
      }
    }

    // Update the profits field in the Branch model
    await Branch.findByIdAndUpdate(branchId, { profits: totalProfits });

    // Send the total profits as a response
    res.json({ branchProfits: totalProfits });
  } catch (error) {
    console.error('Error fetching branch profits:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

