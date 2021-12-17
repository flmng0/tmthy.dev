<!-- Load a list of sketches into a CardList,
    where each sketch is a DisplayCard.

    Also, make sure to put some description text
    at the top of the page, to explain what a
    "sketch" represents, especially versus a project.

    The above paragraph also makes me consider putting
    sketches and projects onto the same page.
-->
<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit'

	export type Sketch = {
		id: string
		name: string
		brief?: string
		imagePath?: string
	}

	export const load: Load = async ({ fetch }) => {
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
			error: new Error('failed to load sketch directory'),
		}
	}
</script>

<script lang="ts">
	import CardList from '$components/CardList.svelte'
	import DisplayCard from '$components/DisplayCard.svelte'

	export let sketches: Array<Sketch>

	const cardProps = (sketch: Sketch): any => ({
		name: sketch.name,
		href: `/sketches/${sketch.id}`,
		description: sketch.brief,
		imageSrc: sketch.imagePath,
	})
</script>

<main>
	<CardList>
		{#each sketches as sketch}
			<DisplayCard {...cardProps(sketch)} />
		{/each}
	</CardList>
</main>
