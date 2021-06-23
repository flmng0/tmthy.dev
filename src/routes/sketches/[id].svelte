<script context="module">
	export async function load({ page, fetch }) {
		const { id } = page.params

		const request = await fetch(`/sketches/${id}.json`)

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
			error: new Error("Sketch doesn't exist"),
		}
	}
</script>

<script>
	export let name
	export let brief
	export let contentHtml
</script>

<main>
	<h1>{name}</h1>
	<p>{brief}</p>

	{@html contentHtml}
</main>
