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

  const navItems = [
    {
      title: "Overview",
      link: "overview",
      icon: LayoutDashboard,
    },
    { title: "Employees", link: "employees", icon: Users },
    { title: "Departments", link: "departments", icon: Building },
    { title: "Settings", link: "settings", icon: Settings },
    { title: "Check in employees", link: "check-in", icon: LogIn },
    { title: "Check out employees", link: "check-out", icon: LogOut },
  ];

  $: page = $pageStore.url.pathname.split("/")[2];
</script>

<aside class="border h-full min-w-64 flex flex-col gap-3 bg-gray-300 p-3">
  <div class="flex items-center justify-between">
    <span class="text-md font-bold"> MATERDEI HOSPITAL </span>

    <Button pill={true} color="none" class=" w-7 h-7 p-0">
      <SidebarClose class="h-4 w-4" />
    </Button>
  </div>
  <nav class="w-full gap-0.5 flex flex-col">
    {#each navItems as n}
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
    {/each}
  </nav>
  <div class="flex-1 items-end flex flex-row">
    <div class="flex gap-2 p-2 cursor-pointer items-center w-full rounded-md">
      <div>
        <Avatar size="sm" />
      </div>
      <div class="flex w-full text-sm flex-col">
        <span class="font-medium"> Decent J. Femayi </span>
        <span class="text-xs"> EMP2230152 </span>
      </div>

      <ChevronRight class="w-6 h-6" />
    </div>
  </div>
</aside>
