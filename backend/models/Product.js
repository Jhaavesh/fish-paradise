const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Fish Tanks', 'Filters', 'Lights', 'Plants',
        'Fish Food', 'Decorations', 'Live Fish', 'Livestock', 'Others'
      ]
    },
    price:       { type: Number, required: true, min: 0 },
    mrp:         { type: Number, default: 0 },
    unit:        { type: String, default: 'unit' },
    sku:         { type: String, default: '', trim: true },
    brand:       { type: String, default: '', trim: true },
    description: { type: String, default: '' },
    imageUrl:    { type: String, default: '' },
    images:      [{ type: String }],
    badge:       { type: String, enum: ['New','Popular','Best Seller','Sale','Rare','Premium',''], default: '' },
    stock:       { type: Number, default: 0 },
    inStock:     { type: Boolean, default: true },
    featured:    { type: Boolean, default: false },
    gstPercent:  { type: Number, default: 18 },
    weight:      { type: String, default: '' },
    dimensions:  { type: String, default: '' },
    warranty:    { type: String, default: '' },
    // Livestock-specific
    careLevel:   { type: String, default: '' },
    size:        { type: String, default: '' },
    temperature: { type: String, default: '' },
    phRange:     { type: String, default: '' },
    diet:        { type: String, default: '' },
    lifespan:    { type: String, default: '' },
    tankSize:    { type: String, default: '' },
    origin:      { type: String, default: '' },
    compatibility: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);