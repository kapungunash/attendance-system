import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { HospitalEmployee } from './hospital-employee';

export const Hospital = sqliteTable(
  'hospital',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    createdAt: integer('created_at').notNull(),
    address: text('address').notNull(),
    __securitySecret: text("__security_secret")
  }
);

export const HospitalRelations = relations(Hospital, ({ many }) => ({
  employees: many(HospitalEmployee)

}))

export type THospital = typeof Hospital.$inferSelect;
