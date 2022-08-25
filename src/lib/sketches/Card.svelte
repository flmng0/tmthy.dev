<script lang="ts">
	import Canvas from './Canvas.svelte'

	import { cubicInOut } from 'svelte/easing'
	import { fade } from 'svelte/transition'

	import { importSketch } from '$lib/data'
	import type { PauseCallback, Sketch, SketchDetails } from '$lib/data/sketch'

	export let slug: string
	export let details: SketchDetails

	let sketch: Sketch<unknown> | null = null
	let pause: PauseCallback

	const startLoading = async () => {
		sketch = await importSketch(slug)
	}

	const entered = () => {
		if (!hasScreenshot) return

		if (sketch === null) {
			startLoading()
		} else {
			pause?.(false)
		}
	}

	const left = () => {
		if (!hasScreenshot) return

		pause?.(true)
	}

	const transitionOptions = {
		duration: 500,
		easing: cubicInOut,
	}

	$: hasScreenshot = !!details.screenshot
</script>

<div
	class="sketch-card"
	class:with-image={hasScreenshot}
	on:mouseenter={entered}
	on:mouseleave={left}
>
	{#if hasScreenshot}
		<div class="img">
			{#if sketch === null}
				<img
					src={details.screenshot}
					alt="Screenshot of {details.name}"
					out:fade={transitionOptions}
				/>
			{:else}
				<div class="canvas-container" in:fade={transitionOptions}>
					<Canvas {sketch} bind:pause />
				</div>
			{/if}
		</div>
	{/if}

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
		background-color: hsl(60, 30%, 91%);

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
			height: 100%;
		}

		.with-image .description {
			height: auto;
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
