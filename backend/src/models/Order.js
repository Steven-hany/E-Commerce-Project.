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
  tableName: 'order',
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
    total: {
      type: 'decimal',
      precision: 10,
      scale: 2,
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
      inverseSide: 'orders',
    },
    orderItems: {
      target: 'OrderItem',
      type: 'one-to-many',
      inverseSide: 'order',
    },
  },
});