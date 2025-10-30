import { EntitySchema } from 'typeorm';

export class OrderItem {
  constructor(id, orderId, productId, quantity, price, createdAt = new Date()) {
    this.id = id;
    this.order_id = orderId;
    this.product_id = productId;
    this.quantity = quantity;
    this.price = price;
    this.created_at = createdAt;
  }
}

export const OrderItemSchema = new EntitySchema({
  name: 'OrderItem',
  tableName: 'order_item',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    order_id: {
      type: 'uuid',
      nullable: false,
    },
    product_id: {
      type: 'uuid',
      nullable: false,
    },
    quantity: {
      type: 'integer',
      nullable: false,
    },
    price: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      nullable: false,
    },
    created_at: {
      type: 'timestamp',
      createDate: true,
    },
  },
  relations: {
    order: {
      target: 'Order',
      type: 'many-to-one',
      joinColumn: { name: 'order_id' },
      inverseSide: 'orderItems',
    },
    product: {
      target: 'Product',
      type: 'many-to-one',
      joinColumn: { name: 'product_id' },
      inverseSide: 'orderItems',
    },
  },
});