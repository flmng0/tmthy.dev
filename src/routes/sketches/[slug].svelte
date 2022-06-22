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

		const { markdown, source } = await response.json()
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

	import { runSketch, type Sketch } from '$lib/sketch'
	import { onMount } from 'svelte'

	// Sketch object to run the sketch
	export let sketch: Sketch<any>
	// Compiled HTML of the sketch's Markdown
	export let markdown: string
	// Source text of the sketch
	export let source: string

	let canvas: HTMLCanvasElement

	onMount(() => {
		const [cancel] = runSketch(sketch, canvas)

		return () => {
			cancel()
		}
	})
</script>

<main>
	<canvas bind:this={canvas} width={800} height={800} />

	<Modal>
		<!-- `class="highlight" from "$lib/prism.css" to allow for fully featured PrismJS syntax highlighting. -->
		<pre class="highlight">{@html source}</pre>

		<button slot="button" let:open on:click={open}>Show Source</button>
	</Modal>

	<article>
		{@html markdown}
	</article>
</main>

<style lang="scss">
	main {
		display: flex;
		flex-flow: column;

		width: min(100%, 100ch);
		margin: 0 auto;
	}

	canvas {
		background: hsl(60, 30%, 91%);
		margin: 2em;
	}

	button {
		align-self: start;
	}
</style>
