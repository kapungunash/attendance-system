import type { PageServerLoad } from './$types';

export const load = (async (e) => {
  const employees = await e.locals.db.query.HospitalEmployee.findMany({
    columns: {
      role: false
    },
    with: {
      user: {
        columns: {
          email: true,
          createdAt: true,
          username: true,
          fullname: true,
          avatarUrl: true
        }
      }
    },
    where: ({ hospitalId, role }, { eq, and }) => and(eq(role, "employee"), eq(hospitalId, "HS" + e.params.hospital_id))
  })
  return { employees };
}) satisfies PageServerLoad;