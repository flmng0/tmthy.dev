<script lang="ts">
  import { runSketch, type SketchEntry } from "../sketches";

  type Props = { sketch: SketchEntry };

  let { sketch }: Props = $props();

  let sketchCanvas: HTMLCanvasElement;

  $effect(() => {
    runSketch(sketch, sketchCanvas);
  })
</script>

<canvas width={600} height={600} bind:this={sketchCanvas} />

<style>
  canvas {
    width: 100%;
    aspect-ratio: 1;
  }
</style>

