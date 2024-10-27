<script lang="ts">
	import { start } from "../lib/home-hero.ts";

	let canvas: HTMLCanvasElement;

	$effect(() => {
		start(canvas);
	});
</script>

<canvas id="hero-cvs" bind:this={canvas}></canvas>

<style>
	#hero-cvs {
		width: 100%;
		height: 100%;
	}
</style>
