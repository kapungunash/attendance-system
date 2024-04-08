import { HospitalEmployee } from "$lib/models/hospital/hospital-employee";
import { count, eq, or } from "drizzle-orm";
import type { PageServerLoad } from "./$types"
import colors from "tailwindcss/colors"

export const load: PageServerLoad = async (e) => {
  const totalEmployees = (await e.locals.db.select({ value: count(HospitalEmployee.userId) }).from(HospitalEmployee).where(
    or(
      eq(HospitalEmployee.hospitalId, "HS" + e.params.hospital_id),
      eq(HospitalEmployee.hospitalId, e.params.hospital_id)
    )
  ))[0].value;

  return {
    attendenceOverview: {
      "Total Employees": totalEmployees,
      "On Time": 20,
      "Late ": 40,
      "Absent ": 20
    },
    weeklyAttendenceSummaryBarSeries: [
      {
        name: "On Time",
        color: colors.green["500"],
        data: [
          { x: "Mon", y: 231 },
          { x: "Tue", y: 122 },
          { x: "Wed", y: 63 },
          { x: "Thu", y: 421 },
          { x: "Fri", y: 122 },
          { x: "Sat", y: 323 },
          { x: "Sun", y: 111 },
        ],
      },
      {
        name: "Late",
        color: colors.blue["500"],
        data: [
          { x: "Mon", y: 232 },
          { x: "Tue", y: 113 },
          { x: "Wed", y: 341 },
          { x: "Thu", y: 224 },
          { x: "Fri", y: 522 },
          { x: "Sat", y: 411 },
          { x: "Sun", y: 243 },
        ],
      },
      {
        name: "Absent",
        color: colors.amber["500"],
        data: [
          { x: "Mon", y: 232 },
          { x: "Tue", y: 113 },
          { x: "Wed", y: 341 },
          { x: "Thu", y: 224 },
          { x: "Fri", y: 522 },
          { x: "Sat", y: 411 },
          { x: "Sun", y: 243 },
        ],
      },
    ] as ApexCharts.ApexOptions["series"],

  }
}