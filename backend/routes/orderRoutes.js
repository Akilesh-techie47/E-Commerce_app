// routes/orderRoutes.js - Order management routes
const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

// IMPORTANT: specific routes like /myorders must come BEFORE /:id
// otherwise Express will treat "myorders" as an :id value.

// @route   POST /api/orders - create a new order (logged-in user)
router.post('/', protect, createOrder);

// @route   GET /api/orders/myorders - logged-in user's own orders
router.get('/myorders', protect, getMyOrders);

// @route   GET /api/orders - all orders (admin only)
router.get('/', protect, authorize('admin'), getAllOrders);

// @route   GET /api/orders/:id - single order (owner or admin)
router.get('/:id', protect, getOrderById);

// @route   PUT /api/orders/:id/status - update order status (admin only)
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

module.exports = router;
