<script lang="ts">
  import { Button } from "flowbite-svelte";
  import QrScanner from "qr-scanner";
  import { onMount } from "svelte";

  let scanning = false;
  let videoElem: HTMLVideoElement;

  onMount(init);

  function init() {
    const qrScanner = new QrScanner(videoElem, (result) =>
      console.log("decoded qr code:", result)
    );
    qrScanner.start();
  }
  console.log(QrScanner.listCameras(true));
</script>

<main class="p-6 w-min h-full flex">
    <div class="relative aspect-video overflow-hidden rounded-md w-min h-48">
      <div class="w-44 h-44 z-10  border-white border-solid border-4 opacity-45 absolute top-2 left-[50%] -translate-x-[50%] "></div>
      <video bind:this={videoElem}/>
    </div>
    
    <div class="mt-6 w-full font-semibold">
      <div>
        <div>
          EMPLOYEE ID:
        </div>
        <div>
          DEPARTMENT:
        </div>
        <div>
          NAME:
        </div>  
        <Button class="mt-6 w-full">
          Check in 
        </Button>
      </div>
  </div>
</main>

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
