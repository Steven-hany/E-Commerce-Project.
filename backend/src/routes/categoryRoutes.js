const express = require('express');
const cartController = require('../controllers/cartController.js');
const orderController = require('../controllers/orderController.js');
const { authJwt } = require('../middleware/authJwt.js');

const router = express.Router();

router.use(authJwt);

// Cart endpoints
router.get('/', cartController.getCart);
router.post('/items', cartController.addToCart);
router.delete('/items/:productId', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);

// Checkout endpoint
router.post('/checkout', orderController.checkout);

module.exports = router;