<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import { Input, Modal } from "flowbite-svelte";
  import { Button } from "flowbite-svelte";
  import QrScanner from "qr-scanner";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  export let open: boolean;
  let scanning = false;
  let videoElem: HTMLVideoElement;
  let qrScanner: QrScanner;

  let error: string = "";

  let result = writable<string>("");

  onMount(init);

  function init() {
    qrScanner = new QrScanner(videoElem, (r) => {
      console.log(r);
      $result = r;
    });
    qrScanner.start();
  }
</script>

<Modal {open} class="overflow-hidden min-w-min w-min h-full">
  <main class="p-6 w-min h-full flex">
    <div class="relative aspect-video overflow-hidden rounded-md w-min h-48">
      <div
        class="w-44 h-44 z-10 border-white border-solid border-4 opacity-45 absolute top-2 left-[50%] -translate-x-[50%]"
      ></div>
      <video bind:this={videoElem} />
    </div>

    {$result}
    <form
      use:enhance={({}) => {
        return ({ result }) => {
          //@ts-ignore
          alert(result.data.message);
          open = false;
        };
      }}
      action={`/HS${$page.params.hospital_id}/employees/check-in`}
      method="post"
      class="mt-6 w-full font-semibold"
    >
      <Input bind:value={$result} name="employee-id" />
      <p class="text-sm h-5 mt-2 text-left text-destructive">
        {error}
      </p>
      <Button type="submit" disabled={!$result} class="mt-6 w-full"
        >Check out early</Button
      >
    </form>
  </main>
</Modal>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
  }
  reader {
    width: 100%;
    min-height: 500px;
    background-color: black;
  }
</style>
