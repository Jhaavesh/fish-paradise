const r = require('express').Router();
const c = require('../controllers/productController');
r.get('/categories', c.getCategories);
r.get('/', c.getProducts);
r.get('/:id', c.getProduct);
r.post('/', c.createProduct);
r.put('/:id', c.updateProduct);
r.delete('/:id', c.deleteProduct);
module.exports = r;
