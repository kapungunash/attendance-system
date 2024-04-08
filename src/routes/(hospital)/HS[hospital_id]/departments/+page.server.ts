import { and, count, eq, or } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { HospitalEmployee } from '$lib/models/hospital/hospital-employee';

export const load = (async (e) => {
  const departmentsR = await e.locals.db.query.Department.findMany({
    where: ({ hospitalId }, { eq }) => eq(hospitalId, e.params.hospital_id)
  })

  //very bad code ahead

  let departments = await Promise.all(departmentsR.map(async (d) => ({
    ...d,
    numberOfEmployees: await e.locals.db.select({ value: count(HospitalEmployee.userId) }).from(HospitalEmployee).where(
      and(
        or(
          eq(HospitalEmployee.hospitalId, "HS" + e.params.hospital_id),
          eq(HospitalEmployee.hospitalId, e.params.hospital_id)
        ),
        eq(HospitalEmployee.department, d.id),
        eq(HospitalEmployee.role, "employee")

      )
    ).then((e) => e[0].value)
  })))

  return { departments };
}) satisfies PageServerLoad;