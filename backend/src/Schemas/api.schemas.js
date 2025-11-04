/**
 * @swagger
 * components:
 * schemas:
 * # ----------------------------------------------------------------------
 * # 1. AUTH & USER Schemas
 * # ----------------------------------------------------------------------
 * User:
 * type: object
 * description: نموذج مستخدم النظام
 * properties:
 * id: { type: string, description: "معرف المستخدم الفريد", example: "60c72b1f9b1e8b0015f5e9c0" }
 * username: { type: string, description: "اسم المستخدم", example: "ali_saleh" }
 * email: { type: string, description: "البريد الإلكتروني", format: email, example: "ali.saleh@example.com" }
 * role: { type: string, description: "دور المستخدم (user, admin)", example: "user" }
 * is_admin: { type: boolean, description: "هل هو مشرف أم لا", example: false }
 *
 * LoginInput:
 * type: object
 * required: [email, password]
 * description: نموذج بيانات تسجيل الدخول
 * properties:
 * email: { type: string, format: email, example: "ali.saleh@example.com" }
 * password: { type: string, format: password, example: "MySecureP@ss123" }
 *
 * # ----------------------------------------------------------------------
 * # 2. PRODUCT Schemas
 * # ----------------------------------------------------------------------
 * Product:
 * type: object
 * required: [name, price, stock]
 * description: نموذج بيانات المنتج
 * properties:
 * id: { type: string, description: "معرف المنتج الفريد" }
 * name: { type: string, description: "اسم المنتج", example: "هاتف ذكي X" }
 * description: { type: string, description: "وصف تفصيلي للمنتج" }
 * price: { type: number, format: float, description: "سعر المنتج", example: 599.99 }
 * stock: { type: integer, description: "الكمية المتوفرة في المخزون", example: 50 }
 * category: { type: string, description: "تصنيف المنتج", example: "Electronics" }
 *
 * # ----------------------------------------------------------------------
 * # 3. CART Schemas
 * # ----------------------------------------------------------------------
 * CartItem:
 * type: object
 * description: عنصر واحد داخل سلة المشتريات
 * properties:
 * product_id: { type: string, description: "معرف المنتج" }
 * quantity: { type: integer, description: "كمية هذا المنتج في السلة", example: 2 }
 *
 * Cart:
 * type: object
 * description: نموذج سلة المشتريات
 * properties:
 * user_id: { type: string, description: "معرف المستخدم الذي يملك السلة" }
 * items:
 * type: array
 * description: قائمة بعناصر السلة
 * items:
 * $ref: '#/components/schemas/CartItem'
 * total_price: { type: number, format: float, description: "إجمالي سعر السلة قبل الشحن" }
 *
 * # ----------------------------------------------------------------------
 * # 4. ORDER Schemas
 * # ----------------------------------------------------------------------
 * Order:
 * type: object
 * required: [user_id, items]
 * description: نموذج الطلب
 * properties:
 * id: { type: string, description: "معرف الطلب الفريد" }
 * user_id: { type: string, description: "معرف المستخدم الذي قام بالطلب" }
 * items:
 * type: array
 * description: المنتجات المطلوبة (مطابقة لـ CartItem)
 * items:
 * $ref: '#/components/schemas/CartItem'
 * total_amount: { type: number, format: float, description: "المبلغ الإجمالي للطلب", example: 629.99 }
 * status: { type: string, description: "حالة الطلب (Pending, Shipped, Delivered)", example: "Pending" }
 * created_at: { type: string, format: date-time, description: "تاريخ إنشاء الطلب" }
 */
// هذا الملف يستخدم فقط لتعريف Schemas لـ Swagger ولا يحتوي على كود تشغيلي
// يمكن أن تستدعيه في ملف swagger.js
