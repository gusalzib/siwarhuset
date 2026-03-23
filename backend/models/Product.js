const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Pizzas', 'Bakery', 'Manakeesh', 'Desserts', 'Dairy', 'Coffee/Tea', 'Nuts', 'Spices'],
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  image: {
    type: String,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
