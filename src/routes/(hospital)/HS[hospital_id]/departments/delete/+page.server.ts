import { fail } from '@sveltejs/kit';
import type { PageServerLoad, RequestEvent } from './$types';
import { Department } from '$lib/models/department/department';
import { eq } from 'drizzle-orm';

export const load = (async () => {
  return {};
}) satisfies PageServerLoad;


export const actions = {
  default: async (e: RequestEvent) => {
    const deptId = e.url.searchParams.get("dept-id")
    if (!deptId) {
      return fail(400, {
        message: "Department id is required"
      })
    }

    try {
      const res = await e.locals.db.delete(Department).where(eq(Department.id, deptId))
      if (res.rowsAffected === 0) return fail(400, {
        message: "A department with that id does not exist"
      })

    } catch (e) {
      console.log(e)
      return fail(500, {
        message: "Something unexpected happened.  Please try again"
      })
    }
  }
}