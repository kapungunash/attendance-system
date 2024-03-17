import { initializeLucia } from "$lib/config/auth";
import { initializeDB } from "$lib/config/db";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";


const useDatabase: Handle = async ({ event, resolve }) => {
  event.locals.db = await initializeDB();
  return resolve(event);
};


const useAuth: Handle = async ({ event, resolve }) => {
  const lucia = initializeLucia(event.locals.db)
  const sessionId = event.cookies.get(lucia.sessionCookieName);
  if (!sessionId) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);

    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes
    });
  }
  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes
    });
  }
  event.locals.user = user;
  event.locals.session = session;
  return resolve(event);
};


export const handle: Handle = sequence(
  useDatabase,
  useAuth
);