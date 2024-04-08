import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { Hospital } from './hospital';
import { User } from '../user/user';
import { Department } from '../department/department';

export const EmployeeAttendence = sqliteTable(
  'employee_attendence',
  {
    employeeId: text('employee_id'),
    hospitalId: text("hospital_id"),
    checkedInAt: integer('added_at').notNull(),
  }
);

export default EmployeeAttendence