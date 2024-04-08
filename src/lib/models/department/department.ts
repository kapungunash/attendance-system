import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const Department = sqliteTable(
  'department',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    hospitalId: text('hospital_id').notNull(),
    createdAt: integer('created_at').notNull(),
    checkInTime: text('check-in-time').notNull(),
    checkOutTime: text('check-out-time').notNull(),

  }
);

export type TDepartment = typeof Department.$inferSelect;
