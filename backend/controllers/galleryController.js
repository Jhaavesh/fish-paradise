const Gallery = require('../models/Gallery');
const fs      = require('fs');
const path    = require('path');
exports.getGallery = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const isVideo = req.file.mimetype.startsWith('video/');
    const mediaUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const item = await Gallery.create({ title: req.body.title||'', mediaUrl, mediaType: isVideo ? 'video' : 'image', filename: req.file.filename });
    res.status(201).json({ success: true, data: item });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
exports.deleteMedia = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    if (item.filename) { const fp = path.join(__dirname,'..','uploads',item.filename); if(fs.existsSync(fp)) fs.unlinkSync(fp); }
    await item.deleteOne();
    res.json({ success: true, message: 'Deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
exports.updateMedia = async (req, res) => {
  try {
    const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
