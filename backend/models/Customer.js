// backend/models/Customer.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    index: true
  },
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
