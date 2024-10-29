<script lang="ts">
	import type { Snippet } from "svelte";
	import { start } from "../lib/home-hero.ts";

	let { children }: { children: Snippet } = $props();

	let canvas: HTMLCanvasElement;

	let ready: boolean = $state(false);
	let finished: boolean = $state(false);

	const onFinish = () => {
		finished = true;
	};

	$effect(() => {
		start(canvas, onFinish).then(() => ready = true);
	});
</script>

<canvas bind:this={canvas} class:ready></canvas>

{#if finished}
	<div class="container">
		<div class="inner">
			{@render children()}
		</div>
	</div>
{/if}

<style>
	.container {
		overflow-y: auto;
		position: absolute;
		inset: 0;
	}

	@keyframes fadeIn {
		0%{
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
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

	.inner {
		position: relative;

		animation: 0.7s ease-out 0s 1 slideUp;
		animation-fill-mode: forwards;
	}
</style>
