import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { Hospital } from './hospital';
import { User } from '../user/user';
import { Department } from '../department/department';

export const HospitalEmployee = sqliteTable(
  'hospital_employee',
  {
    hospitalId: text('hospital_id'),
    userId: text('user_id').notNull(),
    addedAt: integer('added_at').notNull(),
    department: text("department"),
    role: text("role", { enum: ["employee", "admin", "super-admin"] }),
  }
);


export const HospitaEmployeeRelations = relations(HospitalEmployee, ({ one }) => ({
  hospital: one(Hospital, {
    fields: [HospitalEmployee.hospitalId],
    references: [Hospital.id]
  }),
  department: one(Department, {
    fields: [HospitalEmployee.department], references: [Department.id]
  }),
  user: one(User, { fields: [HospitalEmployee.userId], references: [User.id] })
}))


export type THospitalEmployee = typeof HospitalEmployee.$inferSelect;
