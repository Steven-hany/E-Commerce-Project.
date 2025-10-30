import { EntitySchema } from 'typeorm';

export const ProductSchema = new EntitySchema({
  name: 'Product',
  tableName: 'products',
  columns: {
    id: { type: Number, primary: true, generated: true },
    name: { type: String },
    description: { type: 'text', nullable: true },
    price: { type: 'decimal', precision: 10, scale: 2 },
    stock_qty: { type: Number, default: 0 },
    created_at: { type: 'datetime', createDate: true, nullable: true },
    updated_at: { type: 'datetime', updateDate: true, nullable: true },
    deleted_at: { type: 'datetime', nullable: true, deleteDate: true }
  },
  relations: {
    category: { type: 'many-to-one', target: 'Category', joinColumn: true, eager: true }
  }
});
