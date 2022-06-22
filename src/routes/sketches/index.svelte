<script lang="ts" context="module">
	import type { SketchDetails } from '$lib/sketch'

	import type { Load } from './__types/index'

	export const load: Load = async ({ fetch }) => {
		const response = await fetch(`/sketches.json`)
		if (!response.ok) {
			return {
				status: response.status,
			}
		}

		const { sketches } = await response.json()

		return {
			status: 200,
			props: {
				sketches,
			},
		}
	}
</script>

<script lang="ts">
	import SketchCard from '$lib/sketches/SketchCard.svelte'

	export let sketches: Record<string, SketchDetails>
</script>

<nav class="sketches">
	{#each Object.entries(sketches) as [slug, details]}
		<SketchCard {slug} {details} />
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
