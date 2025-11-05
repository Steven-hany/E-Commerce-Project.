import { Router } from 'express';
import { protect } from '../middleware/authJwt.js';
import { requireAdmin } from '../middleware/requireAdmin.js'; // ✅
import {list,getOne,create,update,remove} from '../controllers/productController.js';


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
r.get('/',list);

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
r.get('/:id',getOne);

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

r.post('/', protect, requireAdmin, create);

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
r.put('/:id', protect, requireAdmin,update);

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
r.delete('/:id', protect, requireAdmin,remove);

export default r;