import { EntitySchema } from 'typeorm';

export class CartItem {
  constructor(id, cartId, productId, quantity, createdAt = new Date()) {
    this.id = id;
    this.cart_id = cartId;
    this.product_id = productId;
    this.quantity = quantity;
    this.created_at = createdAt;
  }
}

export const CartItemSchema = new EntitySchema({
  name: 'CartItem',
  tableName: 'cart_items',
  columns: {
    id: {
      type: 'integer',
      primary: true,
      generated: true,
    },
    cart_id: {
      type: 'integer',
      nullable: false,
    },
    product_id: {
      type: 'integer',
      nullable: false,
    },
    quantity: {
      type: 'integer',
      default: 1,
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
    cart: {
      target: 'Cart',
      type: 'many-to-one',
      joinColumn: { name: 'cart_id' },
      inverseSide: 'cartItems',
    },
    product: {
      target: 'Product',
      type: 'many-to-one',
      joinColumn: { name: 'product_id' },
      inverseSide: 'cartItems',
    },
  },
});