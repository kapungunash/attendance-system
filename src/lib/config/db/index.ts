import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import {
  TURSO_DB_TOKEN,
  TURSO_DB_URL
} from '$env/static/private';
import { dev } from '$app/environment';
import * as schema from "./schema"

const client = !dev
  ? createClient({ url: TURSO_DB_URL, authToken: TURSO_DB_TOKEN })
  : createClient({
    url: 'file:./.data/local.sqlite'
  });

const initializeDB = async () => {
  return drizzle(client, { schema });
};

export { initializeDB }
export type DB = Awaited<ReturnType<Awaited<typeof initializeDB>>>;



