<script lang="ts">
	import { start } from "../lib/home-hero.ts";

	let canvas: HTMLCanvasElement;

	let ready: boolean = $state(false);

	let size = $state({ width: 0, height: 0 });

	$effect(() => {
		start(canvas).then(() => (ready = true));

		size.width = canvas.width;
		size.height = canvas.height;

		window.addEventListener("resize", () => {
			size.width = canvas.width;
			size.height = canvas.height;
		});
	});
</script>

<canvas bind:this={canvas} class:ready></canvas>

<style>
	@keyframes fadeIn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	canvas {
		touch-action: none;
	}

	canvas.ready {
		animation-fill-mode: forwards;
		animation-name: fadeIn;
		animation-delay: 0;
		animation-duration: 0.5s;
		animation-timing-function: ease-in;
	}

	@keyframes slideUp {
		0% {
			top: 100%;
		}
		100% {
			top: calc(100% - 5vh);
		}
	}
</style>
