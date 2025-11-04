import { Router } from 'express';
import { ProductsController } from '../controllers/productController.js';
import { protect } from '../middleware/authJwt.js';
import { requireAdmin } from '../middleware/requireAdmin.js'; // ✅
import { AppDataSource } from '../data-source.js';

const r = Router();

/**
 * @swagger
 * tags:
 * name: Products
 * description: عمليات إدارة المنتجات (عرض، إنشاء، تحديث، حذف)
 */

// ----------------------------------------------------------------------
// 1. GET /products - عرض جميع المنتجات
// ----------------------------------------------------------------------
/**
 * @swagger
 * /products:
 * get:
 * summary: عرض جميع المنتجات
 * tags: [Products]
 * responses:
 * 200:
 * description: قائمة ناجحة بجميع المنتجات
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Product'
 */
r.get('/', ProductsController.list);

// ----------------------------------------------------------------------
// 2. GET /products/{id} - عرض منتج واحد
// ----------------------------------------------------------------------
/**
 * @swagger
 * /products/{id}:
 * get:
 * summary: عرض منتج حسب المعرف (ID)
 * tags: [Products]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: تم العثور على المنتج
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Product'
 * 404:
 * description: المنتج غير موجود
 */
r.get('/:id', ProductsController.getOne);

// ----------------------------------------------------------------------
// 3. POST /products - إنشاء منتج جديد (للمشرفين فقط)
// ----------------------------------------------------------------------
/**
 * @swagger
 * /products:
 * post:
 * summary: إنشاء منتج جديد (للمشرفين فقط)
 * tags: [Products]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Product'
 * responses:
 * 201:
 * description: تم إنشاء المنتج بنجاح
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Product'
 * 401:
 * description: غير مصرح لك (Unauthorized)
 * 403:
 * description: ممنوع (ليس لديك صلاحيات المشرف)
 */
console.log('protect:', typeof protect);
console.log('requireAdmin:', typeof requireAdmin);
console.log('ProductsController.create:', typeof ProductsController.create);
r.post('/', protect, requireAdmin, ProductsController.create);

// ----------------------------------------------------------------------
// 4. PUT /products/{id} - تحديث منتج (للمشرفين فقط)
// ----------------------------------------------------------------------
/**
 * @swagger
 * /products/{id}:
 * put:
 * summary: تحديث بيانات منتج (للمشرفين فقط)
 * tags: [Products]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Product'
 * responses:
 * 200:
 * description: تم تحديث المنتج بنجاح
 * 401:
 * description: غير مصرح لك
 * 404:
 * description: المنتج غير موجود
 */
r.put('/:id', protect, requireAdmin, ProductsController.update);

// ----------------------------------------------------------------------
// 5. DELETE /products/{id} - حذف منتج (للمشرفين فقط)
// ----------------------------------------------------------------------
/**
 * @swagger
 * /products/{id}:
 * delete:
 * summary: حذف منتج (للمشرفين فقط)
 * tags: [Products]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: تم حذف المنتج بنجاح
 * 401:
 * description: غير مصرح لك
 * 404:
 * description: المنتج غير موجود
 */
r.delete('/:id', protect, requireAdmin, ProductsController.remove);

export default r;