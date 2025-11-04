import { DataSource } from 'typeorm';
import { CartSchema } from './models/Cart.js';
import { CartItemSchema } from './models/CartItem.js';
import { OrderSchema } from './models/Order.js';
import { OrderItemSchema } from './models/OrderItem.js';
import { ProductSchema } from './models/Product.js';
import { User } from './models/User.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'ecommerce_db',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  entities: [
    User,
    ProductSchema,
    CartSchema,
    CartItemSchema,
    OrderSchema,
    OrderItemSchema,
  ],
});