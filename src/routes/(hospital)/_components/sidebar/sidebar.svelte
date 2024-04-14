<script lang="ts">
  import { page as pageStore } from "$app/stores";
  import Logo from "$lib/ui/logo";
  import { Avatar, Button } from "flowbite-svelte";
  import {
    Building,
    ChevronRight,
    LayoutDashboard,
    LogIn,
    LogOut,
    Settings,
    SidebarClose,
    Users,
  } from "lucide-svelte";
  import { twMerge } from "tailwind-merge";
  import CheckInModal from "../check-in-modal/check-in-modal.svelte";
  import CheckOutModal from "../check-out-modal/check-out-modal.svelte";
  import hs from "$lib/stores/hospital";

  let isCheckInModalOpen: boolean = false;
  let isCheckOutModalOpen: boolean = false;

  const navItems = [
    {
      title: "Overview",
      link: "overview",
      icon: LayoutDashboard,
    },
    { title: "Employees", link: "employees", icon: Users },
    { title: "Departments", link: "departments", icon: Building },
    { title: "Check in employee", link: "check-in", icon: LogIn },
    { title: "Early Check out employee", link: "check-out", icon: LogOut },
  ];

  $: page = $pageStore.url.pathname.split("/")[2];
</script>

<aside class="border h-full min-w-64 flex flex-col gap-3 bg-gray-300 p-3">
  <div class="flex items-center justify-between">
    <span class="text-md font-bold"> {$hs?.name} </span>

    <Button pill={true} color="none" class=" w-7 h-7 p-0">
      <SidebarClose class="h-4 w-4" />
    </Button>
  </div>
  <nav class="w-full gap-0.5 flex flex-col">
    {#each navItems as n}
      {#if n.link === "check-in" || n.link === "check-out"}
        <button
          on:click={() => {
            if (n.link === "check-in") {
              isCheckInModalOpen = true;
              return;
            }
            return (isCheckOutModalOpen = true);
          }}
          class={twMerge(
            "w-full h-9 flex p-2 rounded-md border border-transparent text-sm items-center gap-2 bg-gray-300 font-medium transition-colors",
            "hover:bg-gray-400",
            page === n.link && "!bg-gray-800 text-white !border-gray-800"
          )}
        >
          <svelte:component this={n.icon} class="h-4 w-4 opacity-80" />
          {n.title}
        </button>
      {:else}
        <a
          href={n.link}
          class={twMerge(
            "w-full h-9 flex p-2 rounded-md border border-transparent text-sm items-center gap-2 bg-gray-300 font-medium transition-colors",
            "hover:bg-gray-400",
            page === n.link && "!bg-gray-800 text-white !border-gray-800"
          )}
        >
          <svelte:component this={n.icon} class="h-4 w-4 opacity-80" />
          {n.title}
        </a>
      {/if}
    {/each}
  </nav>
</aside>

<CheckInModal bind:open={isCheckInModalOpen} />
<!-- <CheckOutModal bind:open={isCheckOutModalOpen} /> -->
