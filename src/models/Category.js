import { EntitySchema } from 'typeorm';

export const CategorySchema = new EntitySchema({
  name: 'Category',
  tableName: 'categories',
  columns: {
    id: { type: Number, primary: true, generated: true },
    name: { type: String, unique: true },
    created_at: { type: 'datetime', createDate: true, nullable: true },
    updated_at: { type: 'datetime', updateDate: true, nullable: true }
  },
  relations: {
    products: { type: 'one-to-many', target: 'Product', inverseSide: 'category' }
  }
});
