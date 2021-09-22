<script lang="ts" context="module">
	export async function load({ fetch }) {
		const request = await fetch('/api/sketches.json')

		if (request.ok) {
			const data = await request.json()
			return {
				props: {
					...data,
				},
			}
		}

		return {
			status: request.status,
			error: new Error('Failed to load sketch index'),
		}
	}
</script>

<script lang="ts">
	import DisplayCard from '$components/DisplayCard.svelte'
	import Main from '$components/Main.svelte'

	import type { CardItem, Sketch } from '$lib/types'

	export let sketches: Array<Sketch>

	const sketchRoute = (id: string): string => `/sketches/${id}`
	const cardItem = (sketch: Sketch): CardItem => ({
		name: sketch.name,
		description: sketch.brief,
		imagePath: null,
	})
</script>

<svelte:head>
	<title>Sketch Directory | flmng0</title>
</svelte:head>

<Main>
	<nav>
		{#each sketches as sketch (sketch.id)}
			<a sveltekit:prefetch href={sketchRoute(sketch.id)}>
				<DisplayCard item={cardItem(sketch)} />
			</a>
		{/each}
	</nav>
</Main>

<style lang="scss">
	a {
		display: block;
		text-decoration: none;

		& + & {
			margin-top: 1em;
		}
	}
</style>
