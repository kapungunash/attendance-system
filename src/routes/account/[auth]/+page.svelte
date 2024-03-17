<script lang="ts">
  import { Button, Input, Label } from "flowbite-svelte";
  import { Loader2, X } from "lucide-svelte";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import Logo from "$lib/ui/logo";
  import { superForm } from "sveltekit-superforms/client";
  import { twMerge } from "tailwind-merge";
  import type { PageData } from "./$types";

  export let data: PageData;

  let errorMessage: string = "";

  const {
    form: superFormStore,
    errors,
    constraints,
    delayed,
    enhance,
  } = superForm(data.form, {
    delayMs: 200,
    taintedMessage: null,
    onSubmit() {
      errorMessage = "";
    },
  });

  onMount(() => {
    errorMessage = $page.url.searchParams.get("error") ?? "";
    if ($page.url.searchParams.get("error")) goto("?");
  });
</script>

<div
  class="h-screen min-h-screen relative overflow-hidden flex flex-col sm:flex-center pt-[10%] sm:pt-0"
>
  <div class="sm:max-w-[28rem] w-full px-4 flex flex-col gap-6">
    <div class="flex flex-col space-y-2 sm:text-center sm:items-center">
      <Logo class="h-12 w-12 mb-4" />
      <h1 class="text-2xl font-semibold tracking-tight">
        {$page.params.auth === "sign-in"
          ? "Sign in to your account"
          : "Sign up for an account"}
      </h1>
      <p class="text-sm text-secondary">
        Enter your hospital ID, Employee Id and Password to continue
      </p>
    </div>

    <form use:enhance action="/account/{$page.params.auth}" method="post">
      <div class="grid gap-2">
        <input-group class="space-y-3">
          <div class="grid gap-1">
            <Label
              for="hospital-id"
              class={twMerge("text-destructive-foreground" && $errors.email)}
              >Hospital ID</Label
            >
            <Input
              bind:value={$superFormStore.email}
              {...$constraints.email}
              id="hospital-id"
              name="hospital-id"
              placeholder="HOS1218074"
              type="text"
              autocomplete="off"
              autocapitalize="none"
              required
            />
          </div>

          <div class="grid gap-1">
            <Label
              for="hospital-id"
              class={twMerge("text-destructive-foreground" && $errors.email)}
              >EC Number</Label
            >
            <Input
              bind:value={$superFormStore.email}
              {...$constraints.email}
              id="hospital-id"
              name="hospital-id"
              placeholder="EMP1218074"
              type="text"
              autocomplete="off"
              autocapitalize="none"
              required
            />
          </div>

          <div class="grid gap-1">
            <Label for="password">Password</Label>
            <Input
              bind:value={$superFormStore.password}
              {...$page.params.auth == "sign-up" ? $constraints.password : {}}
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              autocapitalize="none"
              autocomplete="off"
              autocorrect="off"
              required
            />
          </div>
        </input-group>

        <Button type="submit" class="mt-6" disabled={$delayed}>
          {#if $delayed}
            <Loader2 class="mr-2 animate-spin h-5 w-5" />
          {/if}
          Continue
        </Button>
      </div>
    </form>

    <p class="text-sm h-5 mt-2 text-left text-destructive">
      {(errorMessage || $errors._errors?.at(0)) ?? ""}
    </p>
  </div>
</div>
