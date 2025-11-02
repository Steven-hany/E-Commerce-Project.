import { Router } from 'express';
import { 
  getUserOrders, 
  getOrderDetail, 
  updateOrderStatus, 
  getAllOrders 
} from '../controllers/orderController.js';
import { authenticateToken, requireAdmin } from '../middleware/authJwt.js';

const router = Router();

router.get('/', authenticateToken, getUserOrders);
router.get('/:id', authenticateToken, getOrderDetail);
router.patch('/:id/status', authenticateToken, requireAdmin, updateOrderStatus);
router.get('/admin/all', authenticateToken, requireAdmin, getAllOrders);

export default router;
