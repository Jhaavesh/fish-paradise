const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

exports.getProducts = async (req, res) => {
  try {
    const { category, featured, search, limit=20 } = req.query;
    const q = {};
    if (category && category !== 'All') q.category = category;
    if (featured) q.featured = featured === 'true';
    if (search)   q.name = { $regex: search, $options: 'i' };
    const products = await Product.find(q).sort({ createdAt: -1 }).limit(Number(limit));
    res.json({ success: true, count: products.length, data: products });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
exports.getProduct = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: p });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
exports.createProduct = async (req, res) => {
  try {
    const p = await Product.create(req.body);
    res.status(201).json({ success: true, data: p });
  } catch (e) { res.status(400).json({ success: false, message: e.message }); }
};
exports.updateProduct = async (req, res) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!p) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: p });
  } catch (e) { res.status(400).json({ success: false, message: e.message }); }
};
exports.deleteProduct = async (req, res) => {
  try {
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
exports.getCategories = async (req, res) => {
  try {
    const cats = await Product.distinct('category');
    res.json({ success: true, data: cats });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// Upload product image(s)
exports.uploadImage = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    const urls = req.files.map(f => '/uploads/' + f.filename);
    res.json({ success: true, data: urls });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// Delete uploaded image file
exports.deleteImage = async (req, res) => {
  try {
    const { filename } = req.params;
    if (!filename || filename.includes('..')) {
      return res.status(400).json({ success: false, message: 'Invalid filename' });
    }
    const filePath = path.join(__dirname, '..', 'uploads', filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.json({ success: true, message: 'Image deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
