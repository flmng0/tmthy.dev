<script lang="ts">
	import type { Snippet } from "svelte";
	import { start, doZoom } from "../lib/home-hero.ts";

	let { children }: { children: Snippet } = $props();

	let canvas: HTMLCanvasElement;

	let finished: boolean = $state(false);

	const onFinish = () => {
		finished = true;
		doZoom();
	};

	$effect(() => {
		start(canvas, onFinish);
	});
</script>

<canvas bind:this={canvas}></canvas>

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
