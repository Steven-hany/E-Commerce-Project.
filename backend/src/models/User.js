import { EntitySchema } from "typeorm";

export const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    username: {
      type: "varchar",
      nullable: false,
    },
    email: {
      type: "varchar",
      unique: true,
      nullable: false,
    },
    password: {
      type: "varchar",
      nullable: false,
    },
    is_admin: {
      type: "bit",
      default: false,
    },
    active: {
      type: "bit",
      default: true,
    },
    created_at: {
      type: "datetime",
      createDate: true,
    },
  },
});
