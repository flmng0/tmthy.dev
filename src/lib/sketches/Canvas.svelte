<script lang="ts">
	import { importSketch, runSketch, type PauseCallback, type Sketch } from '$lib/sketch'

	import { onMount } from 'svelte'

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
