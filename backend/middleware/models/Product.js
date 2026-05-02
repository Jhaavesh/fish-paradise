const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  category:    { type: String, required: true, enum: ['Fish Tanks','Filters','Lights','Plants','Fish Food','Decorations','Livestock','Others'] },
  price:       { type: Number, required: true, min: 0 },
  unit:        { type: String, default: 'unit' },
  description: { type: String, default: '' },
  imageUrl:    { type: String, default: '' },
  badge:       { type: String, enum: ['New','Popular','Best Seller','Sale',''], default: '' },
  stock:       { type: Number, default: 0 },
  inStock:     { type: Boolean, default: true },
  featured:    { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model('Product', productSchema);
