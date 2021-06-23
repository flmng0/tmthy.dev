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
	import { page } from '$app/stores'
	import { onMount } from 'svelte'

	export let name
	export let brief
	export let contentHtml

	const id = $page.params.id

	onMount(() => {
		const scriptHandle = document.createElement('script')
		scriptHandle.type = 'module'

		// Uses a ?reloadfix=<TIMESPEC> query to force the browser to fully
		// reload the script, including the source.
		const now = new Date().getTime()
		scriptHandle.src = `/sketches/${id}.js?reloadfix=${now}`

		document.body.appendChild(scriptHandle)

		return () => {
			document.body.removeChild(scriptHandle)
		}
	})
</script>

<canvas id="sketch-canvas" width="800" height="800" />

<main>
	<h1>{name}</h1>
	<p>{brief}</p>

	{@html contentHtml}
</main>

<style lang="scss">
	#sketch-canvas {
		width: min(100%, 800px);

		background-color: white;

		box-shadow: 0 2px 8px var(--color-shadow);
	}
</style>
