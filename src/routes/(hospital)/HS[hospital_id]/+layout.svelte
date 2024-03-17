<script lang="ts">
  import hospital from "$lib/stores/hospital";
  import { Loader2 } from "lucide-svelte";
  import { Sidebar } from "../_components/sidebar";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;

  const loadHospital = async (): Promise<void> => {
    $hospital = await data.props.hospital;
  };
</script>

{#await loadHospital()}
  <div class="flex-center w-full h-screen">
    <Loader2 class="w-6 h-6 text-primary-600 animate-spin duration-150" />
  </div>
{:then _}
  <main class="flex h-screen w-screen flex-row">
    <Sidebar />
    <slot />
  </main>
{:catch}
  <div>An error occured while fetching hospital. try again</div>
{/await}
