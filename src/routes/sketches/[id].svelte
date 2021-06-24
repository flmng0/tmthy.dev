<script context="module">
	export async function load({ page, fetch }) {
		const { id } = page.params

		const request = await fetch(`/api/sketches/${id}.json`)

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

<script lang="ts">
	import { onMount } from 'svelte'

	import { page } from '$app/stores'

	export let name: string
	export let brief: string
	export let contentHtml: string

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

<svelte:head>
	<title>Sketch: {name} | flmng0</title>
</svelte:head>

<!-- on:click|preventDefault|stopPropagation={() => {}} -->
<canvas id="sketch-canvas" width="800" height="800" />

<div class="docs">
	<h1>{name}</h1>
	<p>{brief}</p>

	{@html contentHtml}
</div>

<style lang="scss">
	#sketch-canvas {
		user-select: none;

		width: min(100%, 800px);

		background-color: white;
		box-shadow: 0 2px 8px var(--color-shadow);
	}
</style>
