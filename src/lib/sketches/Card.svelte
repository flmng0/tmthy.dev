<script lang="ts">
	import {
		importSketch,
		type CancelCallback,
		type PauseCallback,
		type Sketch,
		type SketchDetails,
	} from '$lib/sketch'
	import Canvas from './Canvas.svelte'

	import { onDestroy } from 'svelte'
	import { fade } from 'svelte/transition'

	export let slug: string
	export let details: SketchDetails

	let canvas: HTMLCanvasElement

	let sketch: Sketch<unknown> | null = null
	let pause: PauseCallback

	const startLoading = async () => {
		sketch = await importSketch(slug)
	}

	const entered = () => {
		if (sketch === null) {
			startLoading()
		} else {
			pause(false)
		}
	}

	const left = () => {
		pause(true)
	}
</script>

<div class="sketch-card" on:mouseenter={entered} on:mouseleave={left}>
	<div class="img">
		{#if sketch === null}
			<img src={details.screenshot} alt="Screenshot of {details.name}" out:fade />
		{:else}
			<div class="canvas-container" in:fade>
				<Canvas {sketch} bind:pause />
			</div>
		{/if}
	</div>

	<div class="description">
		<a href="/sketches/{slug}">
			<h2>{details.name}</h2>
		</a>
		<span class="brief">{details.brief}</span>
	</div>
</div>

<style lang="scss">
	.sketch-card {
		position: relative;
		display: flex;
		flex-flow: column nowrap;
		overflow: hidden;
	}

	.img {
		position: relative;
		width: 100%;
		aspect-ratio: 1;
		background-color: #f8f8f2;

		overflow: hidden;

		& > * {
			transition: 500ms ease-in;
			position: absolute;
			inset: 0;
			width: 100%;
		}
	}

	.description {
		background-color: var(--col-secondary-bg);
		padding: 1em;
	}

	@media (hover: hover) {
		.sketch-card:not(:hover) .img > :global(*) {
			filter: blur(2px);
		}

		.description {
			position: absolute;
			bottom: 0;

			max-height: 100%;

			$headerHeight: 5em;
			transition: transform 500ms;
			transform: translateY(calc(100% - $headerHeight));

			&:hover {
				transform: translateY(0);
				overflow: auto;
			}
		}
	}
</style>
