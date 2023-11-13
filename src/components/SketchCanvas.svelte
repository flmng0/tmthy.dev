<script lang="ts">
  import { onMount } from "svelte";
  import type { Sketch } from "../sketches/common";

  export let slug: string;
  export let background: string | null;
  // export let index: boolean;

  let canvas: HTMLCanvasElement;

  onMount(async () => {
    const sketch = await import(`../sketches/${slug}.ts`).then(
      (s) => s.default as Sketch
    );

    const state = sketch.init(canvas);
    let lastT = 0;

    const tick = (t: number) => {
      sketch.draw(state, t - lastT);

      window.requestAnimationFrame(tick);
    };

    window.requestAnimationFrame((t) => {
      lastT = t;
      tick(t);
    });
  });
</script>

<canvas width={768} height={768} style:background bind:this={canvas} />

<style>
  canvas {
    object-fit: contain;
    width: 100%;
    height: auto;
  }
</style>
