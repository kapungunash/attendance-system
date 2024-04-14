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
      role: false,
      department: false

    },
    with: {
      department: {
        columns: {
          name: true,
          checkInTime: true
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

  const emp = await Promise.all(employees.map(async (em) => {

    const getStatus = async (): Promise<"absent" | "present" | "late" | "excused"> => {

      let today = new Date();
      today.setHours(0, 0, 0, 0);
      let timestamp = today.getTime();

      const isCheckedInStatus = await e.locals.db.query.EmployeeAttendence.findFirst({
        where: ({ checkedInAt, employeeId }, { gte, and, eq }) => and(
          eq(employeeId, em.userId),
          gte(checkedInAt, timestamp))
      })

      console.log(isCheckedInStatus)
      if (!isCheckedInStatus) return "absent";
      let now = new Date();
      let expectedArrivalTime = new Date(`${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${em.department?.checkInTime}`);

      let arrivalTime = new Date(isCheckedInStatus.checkedInAt)

      if (arrivalTime.getTime() > expectedArrivalTime.getTime()) return "late"
      else {
        return "present"
      }
    }

    return {
      ...em,
      status: await getStatus()
    }
  }))

  return { employees: emp, departments };
}) satisfies PageServerLoad;