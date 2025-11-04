import { Router } from 'express';
import * as adminController from '../controllers/adminController.js';
import { protect } from '../middleware/authJwt.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const r = Router();

/**
 * @swagger
 * /admin/metrics:
 *   get:
 *     summary: Get admin metrics (products, sales, users, orders)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Metrics fetched successfully
 *       401:
 *         description: Unauthorized
 */
r.get('/metrics', protect, requireAdmin, adminController.metrics);

/**
 * @swagger
 * /admin/products/{id}:
 *   delete:
 *     summary: Delete product by ID (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
r.delete('/products/:id', protect, requireAdmin, adminController.deleteProduct);

/**
 * @swagger
 * /admin/overview:
 *   get:
 *     summary: Get admin dashboard overview
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overview data fetched successfully
 *       401:
 *         description: Unauthorized
 */
r.get('/overview', protect, requireAdmin, adminController.getOverview);

export default r;