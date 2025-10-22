import { Router } from 'express';
import { ProductsController } from '../controllers/products.controller.js';
import { authJwt } from '../middleware/authJwt.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const r = Router();
r.get('/', ProductsController.list);
r.get('/:id', ProductsController.getOne);
r.post('/', authJwt, requireAdmin, ProductsController.create);
r.put('/:id', authJwt, requireAdmin, ProductsController.update);
r.delete('/:id', authJwt, requireAdmin, ProductsController.remove);
export default r;
