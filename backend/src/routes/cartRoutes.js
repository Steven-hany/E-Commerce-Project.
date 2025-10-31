import { Router } from 'express';
import { 
  getCart, 
  addOrUpdateCartItem, 
  removeCartItem, 
  checkout 
} from '../controllers/cartController.js';
import { authenticateToken } from '../middleware/authJwt.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getCart);
router.post('/items', addOrUpdateCartItem);
router.delete('/items/:productId', removeCartItem);
router.post('/checkout', checkout);

export default router;