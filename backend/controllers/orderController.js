const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');

function createReceiptCode(orderId) {
  return `FP-${String(orderId).slice(-8).toUpperCase()}`;
}

function isCodEnabled() {
  return process.env.COD_ENABLED !== 'false';
}

function isOnlineEnabled() {
  return process.env.ONLINE_PAYMENT_ENABLED !== 'false' && !!process.env.RAZORPAY_KEY_ID && !!process.env.RAZORPAY_KEY_SECRET;
}

function getRazorpayClient() {
  if (!isOnlineEnabled()) {
    return null;
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

function buildOrderPayload(body) {
  const paymentMethod = body.paymentMethod === 'ONLINE' ? 'ONLINE' : 'COD';

  return {
    customerName: body.customerName,
    customerEmail: body.customerEmail,
    customerPhone: body.customerPhone || '',
    address: body.address || '',
    items: (body.items || []).map(item => ({
      productId: item.productId || '',
      name: item.name || '',
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      imageUrl: item.imageUrl || '',
    })),
    totalAmount: Number(body.totalAmount) || 0,
    status: body.status || 'pending',
    paymentMethod,
    paymentProvider: paymentMethod === 'ONLINE' ? 'razorpay' : 'cod',
    paymentStatus: paymentMethod === 'ONLINE' ? 'initiated' : 'pending',
    notes: body.notes || '',
  };
}

exports.getPaymentConfig = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        codEnabled: isCodEnabled(),
        onlineEnabled: isOnlineEnabled(),
        provider: 'razorpay',
      },
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { customerName, customerEmail, items, totalAmount, paymentMethod } = req.body;

    if (!customerName || !customerEmail || !items?.length) {
      return res.status(400).json({ success: false, message: 'Name, email and items required.' });
    }

    if (!Number(totalAmount) || Number(totalAmount) <= 0) {
      return res.status(400).json({ success: false, message: 'A valid total amount is required.' });
    }

    if (paymentMethod === 'COD' && !isCodEnabled()) {
      return res.status(400).json({ success: false, message: 'Cash on delivery is currently unavailable.' });
    }

    if (paymentMethod === 'ONLINE' && !isOnlineEnabled()) {
      return res.status(400).json({ success: false, message: 'Online payments are currently unavailable.' });
    }

    const order = new Order(buildOrderPayload(req.body));
    order.receiptCode = createReceiptCode(order._id);
    await order.save();

    res.status(201).json({ success: true, message: 'Order placed!', data: order });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.createPaymentOrder = async (req, res) => {
  try {
    const razorpay = getRazorpayClient();

    if (!razorpay) {
      return res.status(503).json({ success: false, message: 'Razorpay is not configured on the server.' });
    }

    const order = await Order.findById(req.body.orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (order.paymentMethod !== 'ONLINE') {
      return res.status(400).json({ success: false, message: 'This order is not marked for online payment.' });
    }

    const amount = Math.round(Number(order.totalAmount) * 100);
    if (!amount) {
      return res.status(400).json({ success: false, message: 'Order amount is invalid.' });
    }

    const paymentOrder = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: order.receiptCode || createReceiptCode(order._id),
      notes: {
        localOrderId: String(order._id),
        customerName: order.customerName,
      },
    });

    order.gatewayOrderId = paymentOrder.id;
    order.paymentStatus = 'initiated';
    order.paymentFailureReason = '';
    await order.save();

    res.json({
      success: true,
      data: {
        keyId: process.env.RAZORPAY_KEY_ID,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        gatewayOrderId: paymentOrder.id,
        localOrderId: String(order._id),
        receiptCode: order.receiptCode,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
      },
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!isOnlineEnabled()) {
      return res.status(503).json({ success: false, message: 'Razorpay is not configured on the server.' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      order.paymentStatus = 'failed';
      order.paymentFailureReason = 'Signature verification failed';
      await order.save();
      return res.status(400).json({ success: false, message: 'Payment signature verification failed.' });
    }

    order.gatewayOrderId = razorpay_order_id;
    order.gatewayPaymentId = razorpay_payment_id;
    order.paymentSignature = razorpay_signature;
    order.paymentStatus = 'paid';
    order.paymentFailureReason = '';
    order.paidAt = new Date();
    await order.save();

    res.json({ success: true, message: 'Payment verified successfully.', data: order });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.markPaymentFailed = async (req, res) => {
  try {
    const order = await Order.findById(req.body.orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (order.paymentStatus !== 'paid') {
      order.paymentStatus = 'failed';
      order.paymentFailureReason = req.body.reason || 'Payment was not completed';
      await order.save();
    }

    res.json({ success: true, data: order });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }

    res.json({ success: true, data: order });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
