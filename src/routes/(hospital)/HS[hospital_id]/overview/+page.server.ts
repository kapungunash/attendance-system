import type { PageServerLoad } from "./$types"
import colors from "tailwindcss/colors"

export const load: PageServerLoad = async (e) => {


  return {
    attendenceOverview: {
      "Total Employees": 80,
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