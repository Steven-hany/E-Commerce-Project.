import { Router } from 'express';
import { CategoriesController } from '../controllers/categories.controller.js';
import { authJwt } from '../middleware/authJwt.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const r = Router();
r.get('/', CategoriesController.list);
r.post('/', authJwt, requireAdmin, CategoriesController.create); // optional admin create
export default r;
