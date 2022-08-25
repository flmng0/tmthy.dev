<script lang="ts">
	import { onMount } from 'svelte'

	import { type PauseCallback, type Sketch, runSketch } from '$lib/data/sketch'

	export let sketch: Sketch<unknown>

	let canvas: HTMLCanvasElement
	let actualPause: PauseCallback

	export const pause = (paused: boolean) => {
		actualPause(paused)
	}

	onMount(() => {
		const [cancel, pause] = runSketch(sketch, canvas)

		actualPause = pause

		return () => {
			cancel()
		}
	})
</script>

<canvas bind:this={canvas} width={800} height={800} />

<style>
	canvas {
		width: 100%;
		height: 100%;

		font-size: 24px;
		background: hsl(60, 30%, 91%);
	}
</style>
