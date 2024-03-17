import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { Hospital } from './hospital';
import { User } from '../user/user';

export const HospitalEmployee = sqliteTable(
  'hospital_employee',
  {
    hospitalId: text('hospital_id').primaryKey(),
    userId: text('user_id').notNull(),
    addedAt: integer('added_at').notNull(),
    role: text("role", { enum: ["employee", "admin", "super-admin"] }),
  }
);

export const HospitaEmployeeRelations = relations(HospitalEmployee, ({ one }) => ({
  hospital: one(Hospital, { fields: [HospitalEmployee.hospitalId], references: [Hospital.id] }),
  user: one(User, { fields: [HospitalEmployee.userId], references: [User.id] })
}))


export type THospitalEmployee = typeof HospitalEmployee.$inferSelect;
