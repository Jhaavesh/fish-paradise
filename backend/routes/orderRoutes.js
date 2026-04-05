const router     = require('express').Router();
const controller = require('../controllers/orderController');

router.post('/',      controller.createOrder);
router.get('/',       controller.getOrders);
router.patch('/:id',  controller.updateOrderStatus);

module.exports = router;