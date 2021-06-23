<script context="module">
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

<script>
	export let sketches

	const sketchRoute = (id) => `/sketches/${id}`
</script>

<main>
	<ul>
		{#each sketches as sketch (sketch.id)}
			<a class="sketch" href={sketchRoute(sketch.id)}>
				<h2 class="sketch__name">{sketch.name}</h2>
				<p class="sketch__brief">{sketch.brief}</p>
			</a>
		{/each}
	</ul>
</main>

<style>
	a {
		text-decoration: none;
	}
</style>
