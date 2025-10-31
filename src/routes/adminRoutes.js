import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { authJwt } from '../middleware/authJwt.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const r = Router();
r.get('/metrics', authJwt, requireAdmin, AdminController.metrics);
export default r;
