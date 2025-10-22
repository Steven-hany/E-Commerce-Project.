import { EntitySchema } from 'typeorm';

export const UserSchema = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: { type: Number, primary: true, generated: true },
    email: { type: String, unique: true },
    password_hash: { type: String },
    is_admin: { type: Boolean, default: false }
  }
});
