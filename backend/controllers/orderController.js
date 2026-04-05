const Order = require('../models/Order');
exports.createOrder = async (req, res) => {
  try {
    const { customerName, customerEmail, items, totalAmount } = req.body;
    if (!customerName || !customerEmail || !items?.length) return res.status(400).json({ success: false, message: 'Name, email and items required.' });
    const order = await Order.create(req.body);
    res.status(201).json({ success: true, message: 'Order placed!', data: order });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: order });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
