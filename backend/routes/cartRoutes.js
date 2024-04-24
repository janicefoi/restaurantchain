// Import necessary modules and models
const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Drink = require('../models/Drink');


// Check if there is an existing cart for the customer and branch
router.get('/cart/check', async (req, res) => {
    try {
      const { customer, branch } = req.query;
      const existingCart = await Cart.findOne({ customer, branch });
      res.json(existingCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
// Create a new cart
router.post('/cart', async (req, res) => {
    try {
      const { customer, branch, drinks, totalPrice } = req.body;
      const cart = new Cart({ customer, branch, drinks, totalPrice });
      await cart.save();
      res.status(201).json(cart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });  
// Add a drink to an existing cart
router.patch('/cart/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { drink, quantity, totalPrice } = req.body; // Include totalPrice from frontend
      
      // Update the cart with the new drink and the provided total price
      const updatedCart = await Cart.findByIdAndUpdate(
        id,
        { 
          $push: { drinks: { drink, quantity } },
          totalPrice: totalPrice // Use the provided total price
        },
        { new: true }
      );
  
      res.json(updatedCart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

// GET endpoint to fetch cart details by customer ID and branch ID
router.get('/cart/:customerId/:branchId', async (req, res) => {
  try {
    const { customerId, branchId } = req.params;
    
    // Find the cart using customer ID and branch ID
    const cart = await Cart.findOne({ customer: customerId, branch: branchId });
    
    if (!cart) {
      // If cart is not found, return 404 status with an error message
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    // If cart is found, return it in the response
    res.json(cart);
  } catch (error) {
    // If any error occurs, return 500 status with the error message
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to fetch customer carts
router.get('/customer-carts/:customerId', async (req, res) => {
    try {
      const customerId = req.params.customerId;
      // Fetch customer carts from the database using the customer ID
      const customerCarts = await Cart.find({ customer: customerId });
      res.json(customerCarts);
    } catch (error) {
      console.error('Error fetching customer carts:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Get all carts
router.get('/carts', async (req, res) => {
  try {
    const carts = await Cart.find();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a cart by ID
router.get('/carts/:id', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove a drink from the cart
router.patch('/cart/remove/:cartId/:drinkId', async (req, res) => {
    const { cartId, drinkId } = req.params;
  
    try {
      const cart = await Cart.findById(cartId);
  
      if (!cart) {
        return res.status(404).json({ success: false, error: 'Cart not found' });
      }
  
      // Find the index of the drink in the cart
      const drinkIndex = cart.drinks.findIndex(drink => drink._id.toString() === drinkId);
  
      if (drinkIndex === -1) {
        return res.status(404).json({ success: false, error: 'Drink not found in cart' });
      }
  
      // Remove the drink from the cart
      cart.drinks.splice(drinkIndex, 1);
  
      // Recalculate the total price
      const totalPrice = cart.drinks.reduce((total, drink) => total + (drink.quantity * drink.price), 0);
  
      cart.totalPrice = totalPrice;
  
      // Save the updated cart
      await cart.save();
  
      res.json({ success: true, cart });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
// Delete a cart by ID
router.delete('/cart/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deletedCart = await Cart.findByIdAndDelete(id);
      if (!deletedCart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
      res.json({ message: 'Cart deleted successfully', deletedCart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
module.exports = router;
