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
  target: Cart, // ✅ ربط الكلاس بالـ EntitySchema
  tableName: 'carts',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    is_active: {
      type: 'bit',
      default: true,
    },
    user_id: {
      type: 'int',
      nullable: false,
    },
    created_at: {
      type: 'datetime2',
      createDate: true,
    },
    updated_at: {
      type: 'datetime2',
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