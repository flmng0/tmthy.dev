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

<SketchCardList {sketches} />
