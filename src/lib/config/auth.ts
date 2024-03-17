import { Lucia } from 'lucia';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { dev } from '$app/environment';
import { UserSession, type TUserSession } from '$lib/models/user/user-session';
import { User, type TUser } from '$lib/models/user/user';
import type { DB } from './db';

const initializeLucia = (db: DB) => {
	//@ts-ignore
	const adapter = new DrizzleSQLiteAdapter(db, UserSession, User);
	return new Lucia(adapter, {
		getUserAttributes: (attributes) => {
			return {
				id: attributes.id
			};
		},
		getSessionAttributes: (attributes) => {
			return {
				createdAt: attributes.createdAt,
				ipAddress: attributes.ipAddress,
				userAgent: attributes.userAgent
			};
		},
		sessionCookie: {
			attributes: {
				secure: !dev
			}
		}
	});
};


type Auth = ReturnType<typeof initializeLucia>;

export { initializeLucia, type Auth };

declare module 'lucia' {
	interface Register {
		Lucia: ReturnType<typeof initializeLucia>;
		DatabaseUserAttributes: Pick<TUser, 'id'>;
		DatabaseSessionAttributes: Pick<
			TUserSession,
			'createdAt' | 'ipAddress' | 'userAgent'
		>;
	}
}
