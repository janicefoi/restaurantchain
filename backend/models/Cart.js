// models/Cart.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
    index: true
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true,
    index: true
  },
  drinks: [{
    drink: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Drink',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  }],
  totalPrice: {
    type: Number,
    required: true,
    index: true
  }
});


const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
