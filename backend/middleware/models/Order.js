const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  customerName:  { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, default: '' },
  address:       { type: String, default: '' },
  items: [{
    productId: String,
    name:      String,
    price:     Number,
    quantity:  { type: Number, default: 1 },
    imageUrl:  String,
  }],
  totalAmount:   { type: Number, required: true },
  status:        { type: String, enum: ['pending','confirmed','shipped','delivered','cancelled'], default: 'pending' },
  paymentMethod: { type: String, default: 'COD' },
  notes:         { type: String, default: '' },
}, { timestamps: true });
module.exports = mongoose.model('Order', orderSchema);
