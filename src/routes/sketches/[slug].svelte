<script lang="ts" context="module">
	import type { Load } from './__types/[slug]'

	import { importSketch } from '$lib/data'

	export const load: Load = async ({ params, fetch }) => {
		const { slug } = params

		const response = await fetch(`/sketches/${slug}.json`)
		if (!response.ok) {
			return {
				status: response.status,
			}
		}

		const { markdown, source } = await response.json()

		return {
			status: 200,
			props: {
				slug,
				markdown,
				source,
			},
		}
	}
</script>

<script lang="ts">
	import Modal from '$lib/Modal.svelte'
	import '$lib/prism.css'

	import type { Sketch } from '$lib/data/sketch'
	import { onMount } from 'svelte'
	import SketchCanvas from '$lib/sketches/Canvas.svelte'

	// Sketch name
	export let slug: string
	// Compiled HTML of the sketch's Markdown
	export let markdown: string
	// Source text of the sketch
	export let source: string

	let sketch = importSketch(slug)
</script>

<main>
	{#await sketch}
		<div class="skeleton" />
	{:then sketch}
		<SketchCanvas {sketch} />
	{/await}

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
		display: grid;
		grid-auto-flow: row;
		grid-template-columns: min(80ch, 100%) 1fr;

		width: min(100%, 100ch);
		margin: 0 auto;

		> * {
			grid-column: 1;
		}
	}

	button {
		align-self: start;
	}

	@keyframes spin {
		from {
			transform: rotate(45deg);
		}
		to {
			transform: rotate(405deg);
		}
	}

	.skeleton {
		width: min(100%, 100ch);
		aspect-ratio: 1;
		margin: 0 auto;

		background-color: rgb(233, 233, 233);

		display: grid;
		place-items: center;

		&::after {
			content: '';
			width: 10%;
			aspect-ratio: 1;
			border: 1em solid rgb(212, 212, 212);
			border-bottom-color: rgb(190, 190, 190);
			opacity: 0.5;

			border-radius: 50%;

			animation: spin 500ms ease-in-out infinite;
		}
	}
</style>
