<script lang="ts">
  import { onMount } from "svelte";
  import type { Sketch } from "../sketches/common";

  export let appName: string;
  export let background: string | null;

  let sketchRoot: HTMLDivElement;

  onMount(async () => {
    const { Elm } = await import(`../../sketches/${appName}.elm`);

    Elm[appName].init({
      node: sketchRoot
    })
  });
</script>

<div id="sketchRoot" bind:this={sketchRoot}></div>

<style>
  canvas {
    object-fit: contain;
    aspect-ratio: 1;
    height: auto;
    width: 100%;
  }
</style>
