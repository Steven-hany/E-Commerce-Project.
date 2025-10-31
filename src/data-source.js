
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "./models/User.js";

// تحميل ملف .env من جذر المشروع
dotenv.config({ path: `${process.cwd()}/backend/.env` });

export const AppDataSource = new DataSource({
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
