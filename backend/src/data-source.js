
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "./models/User.js";
import { ProductSchema } from "./models/Product.js";
import { CategorySchema } from "./models/Category.js";
import { ProductsController } from "./controllers/productController.js";

// تحميل ملف .env من جذر المشروع
dotenv.config({ path: `${process.cwd()}/backend/.env` });

export const AppDataSource = new DataSource({
  type: "mssql",
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User , ProductSchema, CategorySchema],
  synchronize: true,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
});

