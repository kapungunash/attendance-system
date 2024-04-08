import { fail } from '@sveltejs/kit';
import type { PageServerLoad, RequestEvent } from './$types';
import { Department } from '$lib/models/department/department';
import { eq } from 'drizzle-orm';
import { User } from '$lib/models/user/user';
import { HospitalEmployee } from '$lib/models/hospital/hospital-employee';

export const load = (async () => {
  return {};
}) satisfies PageServerLoad;


export const actions = {
  default: async (e: RequestEvent) => {
    const userId = e.url.searchParams.get("empl-id")
    if (!userId) {
      return fail(400, {
        message: "User id is required"
      })
    }

    try {
      const res = await e.locals.db.delete(HospitalEmployee).where(eq(HospitalEmployee.userId, userId))
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