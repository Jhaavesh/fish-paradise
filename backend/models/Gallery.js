const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    title:     { type: String, default: '' },
    mediaUrl:  { type: String, required: true },
    mediaType: { type: String, enum: ['image','video'], default: 'image' },
    filename:  { type: String, default: '' },
    featured:  { type: Boolean, default: false },
    order:     { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Gallery', gallerySchema);