const Contact  = require('../models/Contact');
const nodemailer = require('nodemailer');
exports.submitContact = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, service, message } = req.body;
    if (!firstName || !email || !message) return res.status(400).json({ success: false, message: 'Name, email and message required.' });
    const contact = await Contact.create({ firstName, lastName, email, phone, service, message, ipAddress: req.ip });
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS !== 'your_app_password') {
      try {
        const t = nodemailer.createTransport({ host: process.env.EMAIL_HOST, port: +process.env.EMAIL_PORT, secure: false, auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
        await t.sendMail({ from: `"Fish Paradise" <${process.env.EMAIL_USER}>`, to: process.env.EMAIL_TO, subject: `New Enquiry – ${firstName} ${lastName||''}`, html: `<h2 style="color:#00b4b4">New Enquiry</h2><p><b>Name:</b> ${firstName} ${lastName||''}</p><p><b>Email:</b> ${email}</p><p><b>Phone:</b> ${phone||'N/A'}</p><p><b>Service:</b> ${service||'N/A'}</p><p><b>Message:</b> ${message}</p>` });
      } catch (e) { console.warn('Email failed:', e.message); }
    }
    res.status(201).json({ success: true, message: 'Thank you! We will get back to you within 24 hours.' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, count: contacts.length, data: contacts });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
exports.updateStatus = async (req, res) => {
  try {
    const c = await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!c) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: c });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
