// models/Drink.js
const mongoose = require('mongoose');

const drinkSchema = new mongoose.Schema({
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    index: true
  },
  size: {
    type: String,
    enum: ['small', 'medium', 'large'],
    required: true,
    index: true
  },
  price: {
    type: Number,
    required: true,
    index: true
  },
  buyingPrice: {
    type: Number,
    required: true,
    index: true
  },
  profits: {
    type: Number,
    default: function() {
      return this.price - this.buyingPrice; // Fix typo: 'this.price' instead of 'buyingthis.price'
    },
    index: true
  }  
});

const Drink = mongoose.model('Drink', drinkSchema);

module.exports = Drink;
