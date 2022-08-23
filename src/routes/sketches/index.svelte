<script lang="ts" context="module">
	import type { SketchDetails } from '$lib/data/sketch'

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
	import SketchCardList from '$lib/sketches/CardList.svelte'

	export let sketches: Record<string, SketchDetails>
</script>

<header>
	<h1>Sketches</h1>
	<p>Creative coding projects, or small projects that don't need their own GitHub page.</p>
	<p><em>Hover over a sketch to preview</em></p>
</header>

<main>
	<SketchCardList {sketches} />
</main>

<style lang="scss">
	em {
		font-weight: 500;
		color: var(--col-main);
	}
</style>
