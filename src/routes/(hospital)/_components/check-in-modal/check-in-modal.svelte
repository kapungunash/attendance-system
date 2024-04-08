<script lang="ts">
  import { Modal } from "flowbite-svelte";
  import { Button } from "flowbite-svelte";
  import QrScanner from "qr-scanner";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  let scanning = false;
  let videoElem: HTMLVideoElement;
  let qrScanner: QrScanner;

  let result = writable<string>();

  onMount(init);

  function init() {
    qrScanner = new QrScanner(videoElem, (r) => {
      console.log(r);
      $result = r;
    });
    qrScanner.start();
  }
</script>

<Modal class="overflow-hidden min-w-min w-min h-full">
  <main class="p-6 w-min h-full flex">
    <div class="relative aspect-video overflow-hidden rounded-md w-min h-48">
      <div
        class="w-44 h-44 z-10 border-white border-solid border-4 opacity-45 absolute top-2 left-[50%] -translate-x-[50%]"
      ></div>
      <video bind:this={videoElem} />
    </div>

    {$result}
    <div class="mt-6 w-full font-semibold">
      <div>
        <div>EMPLOYEE ID:</div>
        <div>DEPARTMENT:</div>
        <div>NAME:</div>
        <Button class="mt-6 w-full">Check in</Button>
      </div>
    </div>
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
