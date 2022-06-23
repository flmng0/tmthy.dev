<script lang="ts">
	import {
		importSketch,
		runSketch,
		type CancelCallback,
		type PauseCallback,
		type Sketch,
		type SketchDetails,
	} from '$lib/sketch'
	import { onDestroy } from 'svelte'
	import Canvas from './Canvas.svelte'

	export let slug: string
	export let details: SketchDetails

	let state: 'waiting' | 'loading' | 'running' | 'paused' = 'waiting'

	let canvas: HTMLCanvasElement

	let sketch: Promise<Sketch<unknown>> | null = null
	let pause: PauseCallback

	const startLoading = () => {
		if (state !== 'waiting') return

		state = 'loading'

		sketch = importSketch(slug).then((s) => {
			state = 'running'
			return s
		})
	}

	const entered = () => {
		if (state === 'waiting') {
			startLoading()
		} else {
			pause(false)
			state = 'running'
		}
	}

	const left = () => {
		pause(true)
		state = 'paused'
	}
</script>

<div class="sketch-card" on:mouseenter={entered} on:mouseleave={left}>
	<div class="img {state}">
		{#if details.screenshot}
			<img src={details.screenshot} alt="Screenshot of {details.name}" />
		{/if}
		{#if sketch !== null}
			{#await sketch then sketch}
				<Canvas {sketch} bind:pause />
			{/await}
		{/if}
	</div>

	<div class="description">
		<div class="inner">
			<a class="sketch" href="/sketches/{slug}">
				<h2>{details.name}</h2>
			</a>
			<p>{details.brief}</p>
		</div>
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

		&.paused,
		&.running {
			img {
				opacity: 0;
			}

			:global(canvas) {
				opacity: 1;
			}
		}

		:global(canvas) {
			opacity: 0;
		}

		& > :global(*) {
			transition: 500ms ease-in;
			position: absolute;
			inset: 0;
			width: 100%;
		}
	}

	.description .inner {
		background-color: var(--col-secondary-bg);
		padding: 1em;
	}

	@media (hover: hover) {
		.sketch-card:not(:hover) .img > * {
			filter: blur(2px);
		}

		.description {
			position: absolute;
			top: 100%;
			overflow: hidden;

			z-index: 1;

			$headerHeight: 5em;
			transform: translateY(-$headerHeight);

			&:hover {
				filter: drop-shadow(0 0 8px rgba(0, 0, 0, 90%));
			}

			@supports not (clip-path: polygon(0 0)) {
				.inner {
					transition: max-height 500ms;
					max-height: $headerHeight;
				}

				&:hover .inner {
					max-height: var(--height, 500px);
				}
			}

			@supports (clip-path: polygon(0 0)) {
				.inner {
					transition: clip-path 500ms;
					clip-path: polygon(0 0, 100% 0, 100% $headerHeight, 0 $headerHeight);
				}

				&:hover .inner {
					clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
				}
			}
		}
	}
</style>
