<script lang="ts">
  import { enhance } from "$app/forms";
  import type { SubmitFunction } from "@sveltejs/kit";
  import { Input, Label, Modal } from "flowbite-svelte";
  import { Button } from "flowbite-svelte";
  import { Loader2 } from "lucide-svelte";

  export let open: boolean;

  let error: string = "";

  let loading: boolean = false;

  const onSubmit: SubmitFunction = (e) => {
    loading = true;
    return ({ result }) => {
      //@ts-ignore
      if (result?.data?.message) {
        loading = false;
        //@ts-ignore
        return (error = result?.data?.message ?? "");
      }

      location.reload();
    };
  };
</script>

<Modal bind:open class="overflow-hidden h-full">
  <form
    method="POST"
    action={`departments/new`.toString()}
    use:enhance={onSubmit}
    class="p-3 h-full flex flex-col gap-3"
  >
    <div class="grid gap-1">
      <Label for="name">Name</Label>
      <Input
        id="name"
        name="name"
        class="w-full"
        placeholder="Cleaning department"
        type="text"
        autocomplete="off"
        autocapitalize="none"
        required
      />
    </div>
    <div class="grid gap-1">
      <Label for="id">Department ID</Label>
      <Input
        id="id"
        name="id"
        class="w-full"
        placeholder="DP00129429"
        type="text"
        autocomplete="off"
        autocapitalize="none"
        required
      />
    </div>
    <div class="flex gap-3 w-full">
      <div class="grid gap-1 w-full">
        <Label for="check-in-time">Check-in time</Label>
        <Input
          id="check-in-time"
          name="check-in-time"
          class="w-full"
          type="time"
          autocomplete="off"
          required
        />
      </div>
      <div class="grid gap-1 w-full">
        <Label for="check-out-time">Check-out time</Label>
        <Input
          id="check-out-time"
          name="check-out-time"
          class="w-full"
          type="time"
          autocomplete="off"
          required
        />
      </div>
    </div>
    <p class="text-sm h-5 mt-2 text-left text-destructive">
      {error}
    </p>
    <Button disabled={loading} class="mt-6" type="submit">
      {#if loading}
        <Loader2 class="mr-2 animate-spin h-5 w-5" />
      {/if}
      Save</Button
    >
  </form>
</Modal>
