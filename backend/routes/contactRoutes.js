const r = require('express').Router();
const c = require('../controllers/contactController');
r.post('/', c.submitContact);
r.get('/', c.getContacts);
r.patch('/:id', c.updateStatus);
module.exports = r;
