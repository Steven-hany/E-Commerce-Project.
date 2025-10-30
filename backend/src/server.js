// backend/src/server.js

import { AppDataSource } from "./data-source.js";
import app from './app.js'; // تطبيق Express تم استيراده من app.js
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// استيراد الـ Entity صراحةً
import { User } from "./models/User.js";

// استيراد Swagger (يجب أن يكون المسار صحيحاً)
import { swaggerServe, swaggerSetup } from "./swagger.js"; 

// ----------------------------------------------------------------
// إعداد مسار الـ .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, "../.env");

// تحميل المتغيرات من .env
dotenv.config({ path: envPath });

const PORT = process.env.PORT || 3000;

// ✅ تحذير لو في متغير ناقص في .env
["DB_HOST", "DB_PORT", "DB_USER", "DB_PASS", "DB_NAME", "JWT_SECRET"].forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️ المتغير ${key} مش متعرف في .env`);
  }
});

// ----------------------------------------------------------------
// 🎯 تصحيح إعدادات TypeORM لـ MSSQL
AppDataSource.setOptions({
  type: "mssql",
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User], // تأكد من استيراد كل الـ Entities هنا
  synchronize: true, // يجب أن تكون false في الإنتاج
  options: {
    encrypt: false, // لبعض إعدادات الخادم
    trustServerCertificate: true, // ضروري إذا كنت تستخدم شهادة موقعة ذاتياً
  },
});

// ----------------------------------------------------------------
// 🎯 استخدام Swagger
app.use("/api-docs", swaggerServe, swaggerSetup);

// ----------------------------------------------------------------
// التحقق والتشخيص
if (fs.existsSync(envPath)) {
  console.log("✅ ملف .env موجود");
} else {
  console.log("❌ ملف .env مش موجود");
}

console.log("🔍 القيم المقروءة:");
console.log("DB_USER:", process.env.DB_USER);
console.log(`📘 Swagger UI available at http://localhost:${PORT}/api-docs`);
const routeCount = app._router?.stack?.filter(r => r.route).length || 0;
console.log(`🛣️ عدد الراوتات المحملة: ${routeCount}`);
console.log(`⏱️ وقت تشغيل السيرفر: ${new Date().toLocaleString("en-EG")}`);


// ----------------------------------------------------------------
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
    // طباعة رسالة الخطأ فقط لتجنب المعلومات الحساسة
  });