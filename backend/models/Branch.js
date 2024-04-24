const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  location: {
    type: String,
    required: true,
    index: true
  },
  inventory: {
    type: Map,
    of: Number,
    index: true
  },
  sales: {
    type: Number, // Change type to array of numbers if needed
    default: 0,
    index: true
  },
  profits: {
    type: Number,
    default: 0,
    index: true
  },
  password: {
    type: String,
    required: true,
    index: true
  },
  restockingSignal: {
    type: Boolean,
    default: false
  }
});

const Branch = mongoose.model('Branch', branchSchema);

module.exports = Branch;
