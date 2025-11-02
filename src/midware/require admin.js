import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { ProductSchema } from './models/Product.js';
import { CategorySchema } from './models/Category.js';
import { UserSchema } from './models/User.js';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [ProductSchema, CategorySchema, UserSchema],
  synchronize: false, // set true only for local quick try
  logging: false
});
