<script lang="ts">
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

<main class="bg-red-200">
  <video class="h-64 w-64" bind:this={videoElem} src=""></video>
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
