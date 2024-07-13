<script lang="ts">
  import { runSketch, type SketchEntry } from "../sketches";

  type Props = { sketch: SketchEntry };

  let { sketch }: Props = $props();

  let background = sketch.data.background;

  let sketchCanvas: HTMLCanvasElement;

  $effect(() => {
    runSketch(sketch, sketchCanvas);
  })
</script>

<canvas width={600} height={600} bind:this={sketchCanvas} style:--background={background} />

<style>
  canvas {
    width: 100%;
    aspect-ratio: 1;
    
    background-color: var(--background, transparent);
  }
</style>

