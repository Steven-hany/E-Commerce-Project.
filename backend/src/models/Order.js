import { EntitySchema } from 'typeorm';

export class Order {
  constructor(id, userId, total, status = 'PENDING', createdAt = new Date()) {
    this.id = id;
    this.user_id = userId;
    this.total = total;
    this.status = status;
    this.created_at = createdAt;
  }
}

export const OrderSchema = new EntitySchema({
  name: 'Order',
  tableName: 'orders',
  columns: {
    id: {
      type: 'integer',
      primary: true,
      generated: true,
    },
    user_id: {
      type: 'integer',
      nullable: false,
    },
    total: {
      type: 'decimal',
      precision: 10,
      scale: 2,
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
      inverseSide: 'Order',
    },
    orderItems: {
      target: 'OrderItem',
      type: 'one-to-many',
      inverseSide: 'Order',
    },
  },
});