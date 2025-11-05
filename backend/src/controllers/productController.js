import { AppDataSource } from '../data-source.js';
import { CategorySchema } from '../models/Category.js';
import { ProductSchema } from '../models/Product.js';


  export const getOne= async (req, res) => {
    const repo = AppDataSource.getRepository(ProductSchema);
    const product = await repo.findOne({ where: { id: Number(req.params.id), deleted_at: null } });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  };

 export const create= async (req, res) => {
    const repo = AppDataSource.getRepository(ProductSchema);
    const catRepo = AppDataSource.getRepository(CategorySchema);
    const { name, description, price, stock_qty, category_id } = req.body;
    if (!name || price === undefined || !category_id) return res.status(400).json({ error: 'Missing fields' });

    const category = await catRepo.findOne({ where: { id: Number(category_id) } });
    if (!category) return res.status(400).json({ error: 'Invalid category_id' });

    const product = repo.create({ name, description: description ?? null, price, stock_qty: stock_qty ?? 0, category });
    await repo.save(product);
    res.status(201).json(product);
  };

  export const update= async (req, res) => {
    const repo = AppDataSource.getRepository(ProductSchema);
    const product = await repo.findOne({ where: { id: Number(req.params.id), deleted_at: null } });
    if (!product) return res.status(404).json({ error: 'Not found' });

    const { name, description, price, stock_qty, category_id } = req.body;
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (stock_qty !== undefined) product.stock_qty = stock_qty;
    if (category_id !== undefined) {
      const cat = await AppDataSource.getRepository(CategorySchema).findOne({ where: { id: Number(category_id) } });
      if (!cat) return res.status(400).json({ error: 'Invalid category_id' });
      product.category = cat;
    }
    await repo.save(product);
    res.json(product);
  };

  export const remove= async (req, res) => {
    const repo = AppDataSource.getRepository(ProductSchema);
    const product = await repo.findOne({ where: { id: Number(req.params.id), deleted_at: null } });
    if (!product) return res.status(404).json({ error: 'Not found' });
    await repo.softRemove(product);
    res.status(204).send();
  };
export const list= async (req, res) => {
    const repo = AppDataSource.getRepository(ProductSchema);
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '20')));
    const skip = (page - 1) * limit;

    const where = { deleted_at: null };
    //if (req.query.cat) where.CategorySchema = { id: Number(req.query.cat) };

    const [items, total] = await repo.findAndCount({
      where,
      order: { created_at: 'DESC' },
      skip, take: limit
    });
    res.json({ page, limit, total, items });
  };
  