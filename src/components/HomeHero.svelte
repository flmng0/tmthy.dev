<script lang="ts">
	import { start } from "../lib/home-hero.ts";

	let canvas: HTMLCanvasElement;

	$effect(() => {
		start(canvas);
	});
</script>

<canvas bind:this={canvas}></canvas>
