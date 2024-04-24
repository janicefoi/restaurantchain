// backend/models/Headquarters.js
const mongoose = require('mongoose');

const headquartersSchema = new mongoose.Schema({
  name: {
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
  totalSales: {
    type: Number,
    default: 0,
    index: true
  },
  totalProfits: {
    type: Number,
    default: 0,
    index: true
  }
});

const Headquarters = mongoose.model('Headquarters', headquartersSchema);

module.exports = Headquarters;
