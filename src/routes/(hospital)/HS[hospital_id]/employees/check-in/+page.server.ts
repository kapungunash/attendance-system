import EmployeeAttendence from '$lib/models/hospital/employee-attendence';
import type { PageServerLoad, RequestEvent } from './$types';

export const load = (async () => {
  return {};
}) satisfies PageServerLoad;

export const actions = {
  default: async (e: RequestEvent) => {
    const formData = e.request.formData()
    const employeeId = (await formData).get("employee-id")?.toString()

    await e.locals.db.insert(EmployeeAttendence).values({
      checkedInAt: Date.now(),
      employeeId: employeeId
    })
  }
}