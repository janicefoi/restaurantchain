const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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
  },
  status: {
    type: String,
    enum: ['ordered', 'received', 'in_progress', 'delivered'],
    default: 'ordered',
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
