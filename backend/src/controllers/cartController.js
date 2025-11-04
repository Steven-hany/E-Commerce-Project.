import { body, param, validationResult } from 'express-validator';
import { CartService } from '../services/cartService.js';
import asyncHandler from 'express-async-handler'; // ✅ صح

export const getCart = asyncHandler(async (req, res) => {
  const cart = await CartService.getCartWithTotals(
    (await CartService.getOrCreateCart(req.user.id)).id
  );
  res.json(cart);
});

export const addOrUpdateCartItem = [
  body('product_id').isUUID().withMessage('Valid product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const cart = await CartService.addOrUpdateItem(
      req.user.id,
      req.body.product_id,
      req.body.quantity
    );

    res.json(cart);
  })
];

export const removeCartItem = [
  param('productId').isUUID().withMessage('Valid product ID is required'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const cart = await CartService.removeItem(
      req.user.id,
      req.params.productId
    );

    res.json(cart);
  })
];

export const checkout = asyncHandler(async (req, res) => {
  const result = await CartService.checkout(req.user.id);
  res.json(result);
});