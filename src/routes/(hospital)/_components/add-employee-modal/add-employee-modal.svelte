<script lang="ts">
  import { enhance } from "$app/forms";
  import type { SubmitFunction } from "@sveltejs/kit";
  import { Input, Label, Modal, Select } from "flowbite-svelte";
  import { Button } from "flowbite-svelte";
  import { Loader2 } from "lucide-svelte";

  export let open: boolean = false;
  export let departments: { value: string; name: string }[] = [];

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
    action={`employees/new`.toString()}
    use:enhance={onSubmit}
    class="p-3 h-full flex flex-col gap-3"
  >
    <div class="grid gap-1">
      <Label for="name">Name</Label>
      <Input
        id="name"
        name="name"
        class="w-full"
        placeholder="John"
        type="text"
        autocomplete="off"
        autocapitalize="none"
        required
      />
    </div>
    <div class="grid gap-1">
      <Label for="username">Username</Label>
      <Input
        id="username"
        name="username"
        class="w-full"
        placeholder="jdoe"
        type="text"
        autocomplete="off"
        autocapitalize="none"
        required
      />
    </div>
    <div class="grid gap-1">
      <Label for="id">Employee ID</Label>
      <Input
        id="id"
        name="id"
        class="w-full"
        placeholder="EMP0129429"
        type="text"
        autocomplete="off"
        autocapitalize="none"
        required
      />
    </div>
    <div class="grid gap-1 w-full">
      <Label for="email">Email</Label>
      <Input
        id="email"
        placeholder="john@doe.com"
        name="email"
        class="w-full"
        type="email"
        autocomplete="off"
        required
      />
    </div>
    <div class="grid gap-1 w-full">
      <Label for="email">Department</Label>
      <Select
        id="department"
        name="department"
        items={departments}
        class="w-full"
        required
      />
    </div>
    <div class="grid gap-1 w-full">
      <Label for="password">Default password</Label>
      <Input
        id="password"
        name="password"
        placeholder="••••••••"
        class="w-full"
        type="password"
        autocomplete="off"
        required
      />
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
