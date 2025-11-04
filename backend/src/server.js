import { AppDataSource } from "./data-source.js";
import app from './app.js';
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { User } from "./models/User.js";
import { ProductSchema } from "./models/Product.js";
import { CategorySchema } from "./models/Category.js";
import { swaggerServe, swaggerSetup } from "./swagger.js";
import { errorHandler } from './middleware/errorHandler.js';

// ✅ استيراد الراوتات
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';

// إعداد مسار الـ .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, "../.env");

// تحميل المتغيرات من .env
dotenv.config({ path: envPath });
const PORT = process.env.PORT || 3000;

// تحذير لو في متغير ناقص في .env
["DB_HOST", "DB_PORT", "DB_USER", "DB_PASS", "DB_NAME", "JWT_SECRET"].forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️ المتغير ${key} مش متعرف في .env`);
  }
});

// إعدادات TypeORM لـ MSSQL
AppDataSource.setOptions({
  type: "mssql",
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User, ProductSchema, CategorySchema], // ✅ ضيف باقي الـ Entities هنا
  synchronize: false,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
});

// ✅ تسجيل الراوتات تحت /api/v1
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);

// استخدام Swagger
app.use("/api-docs", swaggerServe, swaggerSetup);

// التحقق والتشخيص
if (fs.existsSync(envPath)) {
  console.log("✅ ملف .env موجود");
} else {
  console.log("❌ ملف .env مش موجود");
}

console.log("🔍 القيم المقروءة:");
console.log("DB_USER:", process.env.DB_USER);
console.log(`📘 Swagger UI available at http://localhost:${PORT}/api-docs`);

// دالة لحساب عدد الراوتات
function countRoutes(app) {
  let count = 0;
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      count++;
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach(handler => {
        if (handler.route) count++;
      });
    }
  });
  return count;
}

// دالة لطباعة أسماء الراوتات
function listRoutes(app) {
  console.log("📋 الراوتات المحملة:");
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      const method = Object.keys(middleware.route.methods)[0].toUpperCase();
      console.log(`${method} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach(handler => {
        if (handler.route) {
          const method = Object.keys(handler.route.methods)[0].toUpperCase();
          console.log(`${method} ${handler.route.path}`);
        }
      });
    }
  });
}

console.log(`🛣️ عدد الراوتات المحملة: ${countRoutes(app)}`);
listRoutes(app);
console.log(`⏱️ وقت تشغيل السيرفر: ${new Date().toLocaleString("en-EG")}`);

// ✅ معالجة 404 قبل errorHandler
app.use((req, res, next) => {
  res.status(404).json({ error: 'الصفحة غير موجودة' });
});

// ✅ إضافة middleware لمعالجة الأخطاء
app.use(errorHandler);

// تشغيل قاعدة البيانات والسيرفر
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Database connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error.message);
  });