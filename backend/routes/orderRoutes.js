const router     = require('express').Router();
const controller = require('../controllers/orderController');

router.get('/payment/config', controller.getPaymentConfig);
router.post('/payment/create', controller.createPaymentOrder);
router.post('/payment/verify', controller.verifyPayment);
router.post('/payment/failure', controller.markPaymentFailed);
router.post('/',      controller.createOrder);
router.get('/',       controller.getOrders);
router.patch('/:id',  controller.updateOrderStatus);

module.exports = router;