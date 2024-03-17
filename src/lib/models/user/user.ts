import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const User = sqliteTable(
  'user',
  {
    id: text('id').primaryKey(),
    email: text('email').unique().notNull(),
    createdAt: integer('created_at').notNull(),
    username: text('username').unique().notNull(),
    fullname: text('fullname'),
    avatarUrl: text('avatar_url'),
    passwordHash: text("password_hash").notNull()
  }
);

export type TUser = typeof User.$inferSelect;
