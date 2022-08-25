<script lang="ts">
	import type { PageData } from './$types'

	import Modal from '$lib/Modal.svelte'
	import { importSketch } from '$lib/data'
	import '$lib/prism.css'
	import SketchCanvas from '$lib/sketches/Canvas.svelte'

	export let data: PageData

	const {
		slug, // Sketch name
		markdown, // Compiled HTML of the sketch's Markdown
		source, // Source text of the sketch
	} = data

	$: sketch = importSketch(slug)
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
