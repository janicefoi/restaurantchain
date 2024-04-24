//orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Define routes for CRUD operations on orders

// Create a new order
router.post('/orders', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
// Get orders by customer ID and branch ID
router.get('/orders/:customerId/:branchId', async (req, res) => {
  try {
    const { customerId, branchId } = req.params;
    const orders = await Order.find({ customer: customerId, branch: branchId });
    res.json({ data: orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get a single order by ID
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update an order by ID
router.put('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Delete an order by ID
router.delete('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Endpoint to fetch customer orders
router.get('/customer-orders/:customerId', async (req, res) => {
  try {
    const customerId = req.params.customerId;
    // Fetch customer orders from the database using the customer ID
    const customerOrders = await Order.find({ customer: customerId });
    res.json(customerOrders);
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Get all orders by branch ID
router.get('/branch-orders/:branchId', async (req, res) => {
  try {
    const orders = await Order.find({ branch: req.params.branchId });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
})
// Define a new route to update the status of an order
router.put('/orders/:orderId/status', async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    // Find the order by ID and update its status
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    // Check if the order exists
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Send a success response
    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Error updating order status:', error);
    // Send an error response
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
