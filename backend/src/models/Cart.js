import { EntitySchema } from 'typeorm';

export class Cart {
  constructor(id, userId, createdAt = new Date()) {
    this.id = id;
    this.user_id = userId;
    this.created_at = createdAt;
  }
}

export const CartSchema = new EntitySchema({
  name: 'Cart',
  tableName: 'cart',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    user_id: {
      type: 'uuid',
      nullable: false,
    },
    created_at: {
      type: 'timestamp',
      createDate: true,
    },
    updated_at: {
      type: 'timestamp',
      updateDate: true,
    },
  },
  relations: {
    user: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: { name: 'user_id' },
      inverseSide: 'carts',
    },
    cartItems: {
      target: 'CartItem',
      type: 'one-to-many',
      inverseSide: 'cart',
    },
  },
});