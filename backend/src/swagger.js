import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";

// استخدم process.cwd() لتحديد المسار
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ecommerce API",
      version: "1.0.0",
      // 1. تم تحديث الوصف
      description: "Complete API Documentation for Auth, Users, Products, Cart, and Orders.",
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      // 2. تم حذف النماذج (Schemas) اليدوية من هنا
      // سيتم الآن قراءتها تلقائيًا من ملفات .js
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // 3. تم تحديث المسارات (apis)
  // سيقوم الآن بالبحث في مجلد routes (للمسارات) ومجلد schemas (لنماذج البيانات)
  apis: [
    path.join(process.cwd(), "backend/src/routes/*.js"),
    path.join(process.cwd(), "backend/src/schemas/*.js")
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
export const swaggerServe = swaggerUi.serve;
export const swaggerSetup = swaggerUi.setup(swaggerSpec, { explorer: true });

