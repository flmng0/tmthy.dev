<script lang="ts">
	import type { SketchDetails } from '$lib/sketch'

	import Card from '$lib/sketches/Card.svelte'

	export let sketches: Record<string, SketchDetails>
</script>

<nav class="sketches">
	{#each Object.entries(sketches) as [slug, details]}
		<Card {slug} {details} />
	{/each}
</nav>

<style lang="scss">
	.sketches {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 30ch), 1fr));
		gap: 2em;
	}

	.sketches > :global(.sketch-card):first-of-type {
		grid-column: 1/-1;
	}
</style>
