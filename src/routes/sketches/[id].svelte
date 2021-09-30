<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit'

	export const load: Load = async ({ page, fetch }) => {
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
	import { slide } from 'svelte/transition'

	import { ArrowRightIcon } from 'svelte-feather-icons'

	import { page } from '$app/stores'
	import CodeBlock from '$components/CodeBlock.svelte'
	import Main from '$components/Main.svelte'
	import { siteName } from '$lib/consts'

	export let name: string
	export let brief: string
	export let contentHtml: string

	const id = $page.params.id
	const source = `/sketches/${id}.js`

	// Don't want it to re-highlight the source every time it's shown,
	// since it's highlighted onMount
	let showSource = false

	onMount(() => {
		const scriptHandle = document.createElement('script')
		scriptHandle.type = 'module'

		// Uses a ?reloadfix=<TIMESPEC> query to force the browser to fully
		// reload the script, including the source.
		const now = new Date().getTime()
		scriptHandle.src = `${source}?reloadfix=${now}`

		document.body.appendChild(scriptHandle)

		return () => {
			document.body.removeChild(scriptHandle)
		}
	})
</script>

<svelte:head>
	<title>Sketch: {name} | {siteName}</title>
</svelte:head>

<Main>
	<canvas id="sketch-canvas" width="800" height="800" />

	<div class="source-code" class:showing={showSource}>
		<button
			class="source-code__show"
			on:click={() => {
				showSource = !showSource
			}}
		>
			<span>View Source</span>
			<div class="showing-button"><ArrowRightIcon size="1x" /></div>
		</button>
		<div class="source-code__text">
			<CodeBlock dataSrc={source} language="javascript" />
		</div>
	</div>

	<div class="docs">
		<h1>{name}</h1>
		<p>{brief}</p>

		{@html contentHtml}
	</div>
</Main>

<style lang="scss">
	#sketch-canvas {
		user-select: none;

		display: block;
		margin: 0 auto 2.5rem;

		// Make sure the canvas is visible when the page loads.
		// i.e. when the scroll of the page is 0.
		--visible-area: calc(0.9 * (100vh - var(--header-height) - 1rem));
		width: min(100%, var(--visible-area));

		background-color: hsl(60, 30%, 94%);
		box-shadow: 0 2px 8px var(--color-shadow);
	}

	.source-code {
		&__show {
			cursor: pointer;

			padding: 0.8em 1em;
			width: 100%;

			font-size: 1rem;

			border: 0;
			color: var(--color-fg-secondary);
			background-color: var(--color-bg-secondary);

			&:hover {
				filter: brightness(1.05);
			}

			.showing-button {
				display: inline-block;
				transition: transform var(--transition);
			}
		}

		&__text {
			display: none;
		}

		&.showing &__show {
			border-bottom: 1px solid var(--color-bg-primary);

			.showing-button {
				transform: rotate(90deg);
			}
		}

		&.showing &__text {
			display: block;
		}
	}

	:global(code) {
		font-family: Fira Code, Consolas, 'Courier New', monospace;
	}

	.docs {
		margin-top: 1em;
	}
</style>
