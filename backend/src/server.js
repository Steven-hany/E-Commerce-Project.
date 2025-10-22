
import { AppDataSource } from "./data-source.js";
import express from "express";
import app from "./app.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// استيراد الـ Entity صراحةً
import { User } from "./models/User.js";

// استيراد Swagger
import { swaggerServe, swaggerSetup } from "./swagger.js"; // ← عدّل المسار حسب مكان ملف swagger.js

// إعداد المسار الصحيح للملف .env
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

// إعداد الاتصال بـ SQL Server
AppDataSource.setOptions({
  type: "mssql",
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User],
  synchronize: true,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
});

// التحقق من وجود ملف .env وطباعة محتواه
if (fs.existsSync(envPath)) {
  console.log("✅ ملف .env موجود");
  const content = fs.readFileSync(envPath, "utf-8");
  console.log("📄 محتوى .env:\n", content);
} else {
  console.log("❌ ملف .env مش موجود");
}

console.log("🔍 القيم المقروءة:");
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS);

console.log(`📘 Swagger UI available at http://localhost:${PORT}/api-docs`);

// ✅ طباعة عدد الراوتات المحملة
const routeCount = app._router?.stack?.filter(r => r.route).length || 0;
console.log(`🛣️ عدد الراوتات المحملة: ${routeCount}`);

// ✅ طباعة وقت تشغيل السيرفر
console.log(`⏱️ وقت تشغيل السيرفر: ${new Date().toLocaleString("en-EG")}`);

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Database connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
  });
