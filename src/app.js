import express from 'express';
import products from './routes/products.routes.js';
import categories from './routes/categories.routes.js';
import admin from './routes/admin.routes.js';

const app = express();
app.use(express.json());

app.use('/api/v1/products', products);
app.use('/api/v1/categories', categories);
app.use('/api/v1/admin', admin);

// 404
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

export default app;
