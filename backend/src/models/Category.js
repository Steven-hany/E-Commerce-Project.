import { EntitySchema } from 'typeorm';

export const CategorySchema = new EntitySchema({
  name: 'Category',
  tableName: 'categories',
  columns: {
    id: { type: Number, primary: true, generated: true },
    name: { type: String, unique: true },
    description: { type: String, nullable: true },
    created_at: { type: 'datetime', createDate: true, nullable: true }
  },
  relations: {
    products: { type: 'one-to-many', target: 'Product', inverseSide: 'category' }
  }
});
