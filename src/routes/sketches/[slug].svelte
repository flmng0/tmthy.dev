<script lang="ts" context="module">
	import type { Load } from './__types/[slug]'

	import { importSketch } from '$lib/sketch'

	export const load: Load = async ({ params, fetch }) => {
		const { slug } = params

		const response = await fetch(`/sketches/${slug}.json`)
		if (!response.ok) {
			return {
				status: response.status,
			}
		}

		const { sourcePath, markdown, source } = await response.json()
		const sketch = await importSketch(slug)

		return {
			status: 200,
			props: {
				sketch,
				markdown,
				source,
			},
		}
	}
</script>

<script lang="ts">
	import Modal from '$lib/Modal.svelte'
	import '$lib/prism.css'

	import type { Sketch } from '$lib/sketch'
	import { onMount } from 'svelte'

	// Sketch object to run the sketch
	export let sketch: Sketch<any>
	// Compiled HTML of the sketch's Markdown
	export let markdown: string
	// Source text of the sketch
	export let source: string

	let canvas: HTMLCanvasElement

	onMount(() => {
		const data = sketch.init(canvas)
		if (data === null) {
			return
		}

		let rafIdx: number
		const tick = (t: number) => {
			sketch.draw?.(data, t)
			rafIdx = requestAnimationFrame(tick)
		}

		if (sketch.draw !== null) {
			rafIdx = requestAnimationFrame(tick)
		}

		return () => {
			cancelAnimationFrame(rafIdx)
		}
	})

	// Open callback from source Modal
	let open: () => void
</script>

<canvas bind:this={canvas} width={800} height={800} />

<button on:click={open}>Show Source</button>
<Modal bind:open>
	<!-- `class="highlight" from "$lib/prism.css" to allow for fully featured PrismJS syntax highlighting. -->
	<pre class="highlight">{@html source}</pre>
</Modal>
{@html markdown}
