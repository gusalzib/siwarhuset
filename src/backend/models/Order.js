const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      name: { type: String, required: true },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['Swish', 'Credit Card'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
