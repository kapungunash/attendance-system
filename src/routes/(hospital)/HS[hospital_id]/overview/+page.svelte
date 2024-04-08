<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import colors from "tailwindcss/colors";
  import type { PageData } from "./$types";
  import { Chart, Avatar } from "flowbite-svelte";
  import { Users, ArrowUp, ChevronDown, ChevronRight } from "lucide-svelte";
  import { WeeklyAttendenceSummaryBarOptions } from "./_components/config";

  export let data: PageData;
</script>

<main class="p-3 h-full flex flex-col gap-6 overflow-auto w-full">
  <div class="bg-gray-100 rounded-md border border-gray-300 shadow-sm p-3">
    <div class="font-medium text-lg mb-4">Today's attendence summary</div>

    <div
      class="grid lg:grid-cols-4 grid-cols-2 flex-row gap-3 w-full flex-wrap text-white"
    >
      {#each Object.entries(data.attendenceOverview) as a, i}
        <div
          class={twMerge(
            "h-24 p-4 flex flex-col rounded-md shadow-sm flex-center w-full",
            ["bg-green-500", "bg-blue-500", "bg-red-500", "bg-amber-500"][i]
          )}
        >
          <span class="text-xl font-medium">
            {a[1]}
          </span>
          {a[0]}
        </div>
      {/each}
    </div>
  </div>
  <div
    class="bg-gray-100 flex rounded-md border border-gray-300 shadow-sm p-3 flex-col"
  >
    <div class="font-medium text-lg mb-4">Weekly attendence summary</div>

    <Chart
      options={{
        ...WeeklyAttendenceSummaryBarOptions,
        series: data.weeklyAttendenceSummaryBarSeries,
      }}
    />
  </div>
</main>
