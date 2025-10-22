import { AppDataSource } from '../data-source.js';

export const ProductsController = {
  list: async (req, res) => {
    const repo = AppDataSource.getRepository('Product');
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '20')));
    const skip = (page - 1) * limit;

    const where = { deleted_at: null };
    if (req.query.cat) where.category = { id: Number(req.query.cat) };

    const [items, total] = await repo.findAndCount({
      where,
      order: { created_at: 'DESC' },
      skip, take: limit
    });
    res.json({ page, limit, total, items });
  },

  getOne: async (req, res) => {
    const repo = AppDataSource.getRepository('Product');
    const product = await repo.findOne({ where: { id: Number(req.params.id), deleted_at: null } });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  },

  create: async (req, res) => {
    const productRepo = AppDataSource.getRepository('Product');
    const catRepo = AppDataSource.getRepository('Category');
    const { name, description, price, stock_qty, category_id } = req.body;
    if (!name || price === undefined || !category_id) return res.status(400).json({ error: 'Missing fields' });

    const category = await catRepo.findOne({ where: { id: Number(category_id) } });
    if (!category) return res.status(400).json({ error: 'Invalid category_id' });

    const product = productRepo.create({ name, description: description ?? null, price, stock_qty: stock_qty ?? 0, category });
    await productRepo.save(product);
    res.status(201).json(product);
  },

  update: async (req, res) => {
    const repo = AppDataSource.getRepository('Product');
    const product = await repo.findOne({ where: { id: Number(req.params.id), deleted_at: null } });
    if (!product) return res.status(404).json({ error: 'Not found' });

    const { name, description, price, stock_qty, category_id } = req.body;
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (stock_qty !== undefined) product.stock_qty = stock_qty;
    if (category_id !== undefined) {
      const cat = await AppDataSource.getRepository('Category').findOne({ where: { id: Number(category_id) } });
      if (!cat) return res.status(400).json({ error: 'Invalid category_id' });
      product.category = cat;
    }
    await repo.save(product);
    res.json(product);
  },

  remove: async (req, res) => {
    const repo = AppDataSource.getRepository('Product');
    const product = await repo.findOne({ where: { id: Number(req.params.id), deleted_at: null } });
    if (!product) return res.status(404).json({ error: 'Not found' });
    await repo.softRemove(product);
    res.status(204).send();
  }
};
