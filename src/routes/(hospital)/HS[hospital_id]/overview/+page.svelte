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
    class="bg-gray-100 gap-3 grid grid-cols-2 rounded-md border border-gray-300 shadow-sm p-3"
  >
    <div class="">
      <div class="font-medium text-lg mb-4">Weekly attendence summary</div>

      <Chart
        options={{
          ...WeeklyAttendenceSummaryBarOptions,
          series: data.weeklyAttendenceSummaryBarSeries,
        }}
      />
    </div>
    <div>
      <div class="font-medium text-lg mb-4">Recent Attendees</div>
      <div class="w-full gap-3 place-items-center gap grid grid-cols-2">
        {#each Array(4) as e}
          <div class="flex-center flex-col">
            <Avatar
              size="lg"
              class="mb-3"
              dot={{ placement: "bottom-right", color: "green" }}
            />
            <span class="font-medium"> Decent J. Femayi </span>
            <span class="font-medium"> Cleaning Dept </span>
            <span> EMP1243021 </span>
          </div>
        {/each}
      </div>
    </div>
  </div>
</main>
