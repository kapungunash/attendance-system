import type { PageServerLoad } from './$types';

export const load = (async (e) => {

  const departments = await e.locals.db.query.Department.findMany({
    columns: {
      id: true,
      name: true
    },
    where: ({ hospitalId }, { eq }) => eq(hospitalId, e.params.hospital_id)
  })

  const employees = await e.locals.db.query.HospitalEmployee.findMany({
    columns: {
      role: false
    },
    with: {
      department: {
        columns: {
          name: true
        }
      },
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
    where: ({ hospitalId, role }, { eq, and }) => and(eq(role, "employee"), eq(hospitalId, e.params.hospital_id))
  })
  return { employees, departments };
}) satisfies PageServerLoad;