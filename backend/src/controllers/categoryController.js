import { AppDataSource } from '../data-source.js';

export const list = async (_req, res) => {
  const items = await AppDataSource.getRepository('Category').find({
    order: { name: 'ASC' }
  });
  res.json(items);
};

export const getOne = async (req, res) => {
  const repo = AppDataSource.getRepository('Category');
  const { id } = req.params;

  const category = await repo.findOne({ where: { id } });
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }

  res.json(category);
};

export const create = async (req, res) => {
  const repo = AppDataSource.getRepository('Category');
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'name required' });
  }

  const exists = await repo.findOne({ where: { name } });
  if (exists) {
    return res.status(409).json({ error: 'Category exists' });
  }

  const cat = repo.create({ name });
  await repo.save(cat);
  res.status(201).json(cat);
};

export const remove = async (req, res) => {
  const repo = AppDataSource.getRepository('Category');
  const { id } = req.params;

  const category = await repo.findOne({ where: { id } });
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }

  await repo.remove(category);
  res.json({ message: 'Category deleted' });
};