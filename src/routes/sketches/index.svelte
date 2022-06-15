<script lang="ts" context="module">
	import type { SketchFrontmatter } from '$lib/sketch'

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

	interface SketchInfo extends SketchFrontmatter {
		slug: string
	}
</script>

<script lang="ts">
	export let sketches: SketchInfo[]
</script>

<nav class="sketches">
	{#each sketches as sketch}
		<a class="sketch" href="/sketches/{sketch.slug}">
			{#if sketch.screenshot}
				<img src={sketch.screenshot} alt="Screen shot of {sketch.name} sketch" />
			{/if}
			<h2>{sketch.name}</h2>
			<p>{sketch.brief}</p>
		</a>
	{/each}
</nav>
