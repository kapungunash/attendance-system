import EmployeeAttendence from '$lib/models/hospital/employee-attendence';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, RequestEvent } from './$types';

export const load = (async () => {
  return {};
}) satisfies PageServerLoad;

export const actions = {
  default: async (e: RequestEvent) => {
    const formData = e.request.formData()
    const employeeId = (await formData).get("employee-id")?.toString() ?? ""

    if (
      !((await e.locals.db.query.HospitalEmployee.findFirst({
        columns: {
          userId:true
        },
        where: ({ userId, hospitalId }, { and, eq }) =>
          and(
            eq(userId, employeeId),
            eq(hospitalId, e.params.hospital_id)
          )
      }))?.userId)
    ) return fail(400, {
      message:"User is not a member of the hospital"
    })

    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let timestamp = today.getTime();

    if (
      await e.locals.db.query.EmployeeAttendence.findFirst({
        where:({checkedInAt},{gte})=>gte(checkedInAt, timestamp)
      })
    ) return fail(400, {
      message:"User has already checked in for the day"
    })

    await e.locals.db.insert(EmployeeAttendence).values({
      checkedInAt: Date.now(),
      employeeId: employeeId
    })
  }
}