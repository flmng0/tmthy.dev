<!-- Load a list of sketches into a CardList,
    where each sketch is a DisplayCard.

    Also, make sure to put some description text
    at the top of the page, to explain what a
    "sketch" represents, especially versus a project.

    The above paragraph also makes me consider putting
    sketches and projects onto the same page.
-->
<script lang="ts" context="module">
	import type { Load } from "@sveltejs/kit";

	export type Sketch = {
		id: string;
		name: string;
		brief?: string;
		imagePath?: string;
	};

	export const load: Load = async ({ fetch }) => {
		const request = await fetch("/api/sketches.json");

		if (request.ok) {
			const data = await request.json();
			return {
				props: {
					...data,
				},
			};
		}

		return {
			status: request.status,
			error: new Error("failed to load sketch directory"),
		};
	};
</script>

<script lang="ts">
	import CardList from "$components/CardList.svelte";
	import DisplayCard from "$components/DisplayCard.svelte";
	import { siteName } from "$lib/consts";

	export let sketches: Array<Sketch>;

	const cardProps = (sketch: Sketch): any => ({
		name: sketch.name,
		href: `/sketches/${sketch.id}`,
		description: sketch.brief,
		imageSrc: sketch.imagePath,
		links: {
			source: `/sketches/${sketch.id}.js`,
		},
	});
</script>

<svelte:head>
	<title>Sketch Index | {siteName}</title>
</svelte:head>

<main>
	<div class="text">
		<h1>Sketch Index</h1>
		<p>
			On this site, "sketch" is defined as a small creative coding project, that I either made
			for fun, or are used in a project. The definition draws similarities to sketches used in
			art. They are rough ideas, which become fully fledged after refining.
		</p>
		<p>
			Listed below are sketches; some devised for use throughout the portfolio, and others as
			a creative outlet.
		</p>
	</div>

	<CardList>
		{#each sketches as sketch}
			<DisplayCard {...cardProps(sketch)} />
		{/each}
	</CardList>
</main>

<style lang="scss">
	.text {
		padding: 0 2em;
	}
	p {
		font-size: 1.2rem;
		letter-spacing: 0.05em;
	}
</style>
