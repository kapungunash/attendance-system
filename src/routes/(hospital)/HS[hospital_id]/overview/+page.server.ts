import { HospitalEmployee } from "$lib/models/hospital/hospital-employee";
import { and, count, eq, or } from "drizzle-orm";
import type { PageServerLoad } from "./$types"
import colors from "tailwindcss/colors"

export const load: PageServerLoad = async (e) => {
  const totalEmployees = (await e.locals.db.select({ value: count(HospitalEmployee.userId) }).from(HospitalEmployee).where(
    and(
      or(
        eq(HospitalEmployee.hospitalId, "HS" + e.params.hospital_id),
        eq(HospitalEmployee.hospitalId, e.params.hospital_id)
      ),
      eq(HospitalEmployee.role, "employee")
    )
  ))[0].value;


  const ems = await e.locals.db.query.HospitalEmployee.findMany({
    with: {
      department: true
    },
    where: ({ hospitalId, role }, { eq, and }) => and(eq(role, "employee"), eq(hospitalId, e.params.hospital_id))
  })

  const x = await Promise.all(ems.map(async (em) => {
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
    return await getStatus()
  }))

  console.log(x)

  return {
    attendenceOverview: {
      "Total Employees": totalEmployees,
      "On Time": x.filter(x => x == "present").length,
      "Late ": x.filter(x => x == "late").length,
      "Absent ": x.filter(x => x == "absent").length
    },
    weeklyAttendenceSummaryBarSeries: [
      {
        name: "On Time",
        color: colors.green["500"],
        data: [
          { x: "Mon", y: 2 },
          { x: "Tue", y: 0 },
          { x: "Wed", y: 1 },
          { x: "Thu", y: 4 },
          { x: "Fri", y: 1 },
          { x: "Sat", y: 3 },
          { x: "Sun", y: 1 },
        ],
      },
      {
        name: "Late",
        color: colors.blue["500"],
        data: [
          { x: "Mon", y: 2 },
          { x: "Tue", y: 0 },
          { x: "Wed", y: 3 },
          { x: "Thu", y: 2 },
          { x: "Fri", y: 5 },
          { x: "Sat", y: 4 },
          { x: "Sun", y: 2 },
        ],
      },
      {
        name: "Absent",
        color: colors.amber["500"],
        data: [
          { x: "Mon", y: 2 },
          { x: "Tue", y: 0 },
          { x: "Wed", y: 3 },
          { x: "Thu", y: 2 },
          { x: "Fri", y: 5 },
          { x: "Sat", y: 4 },
          { x: "Sun", y: 2 },
        ],
      },
    ] as ApexCharts.ApexOptions["series"],

  }
}