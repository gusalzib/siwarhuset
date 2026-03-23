const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const addOrderItems = async (req, res) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    items,
    totalAmount,
    paymentMethod,
  } = req.body;

  if (items && items.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  }

  try {
    const order = new Order({
      customerName,
      customerEmail,
      customerPhone,
      items,
      totalAmount,
      paymentMethod,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private/Admin
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name price');

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update order to given status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = req.body.status || order.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderStatus,
  getOrders,
};
