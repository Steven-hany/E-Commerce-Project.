import { Router } from 'express';
import {
  getCart,
  addOrUpdateCartItem,
  removeCartItem,
  checkout
} from '../controllers/cartController.js';
import { protect } from '../middleware/authJwt.js';

const router = Router();

router.use(protect);

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', getCart);

/**
 * @swagger
 * /cart/items:
 *   post:
 *     summary: Add or update item in cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item added/updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/items', addOrUpdateCartItem);

/**
 * @swagger
 * /cart/items/{productId}:
 *   delete:
 *     summary: Remove item from cart by product ID
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed successfully
 *       404:
 *         description: Item not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/items/:productId', removeCartItem);

/**
 * @swagger
 * /cart/checkout:
 *   post:
 *     summary: Checkout current cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Checkout completed successfully
 *       400:
 *         description: Checkout failed
 *       401:
 *         description: Unauthorized
 */
router.post('/checkout', checkout);

export default router;