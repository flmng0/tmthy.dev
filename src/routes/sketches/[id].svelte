<!-- Contents of a sketch. Include a description.
    See https://github.com/flmng0/flmng0.github.io/blob/1e8d97ffa4be867e110949aba4d3879a4bd70fea/src/routes/sketches/%5Bid%5D.svelte
    and src/routes/api/sketches(/[id])?.json.ts.
-->
<script lang="ts" context="module">
	type Context = {
		t: number;
		dt: number;
		ctx: CanvasRenderingContext2D;
		cvs: HTMLCanvasElement;
	};
	export interface Sketch {
		draw(ctx: Context): undefined;
		init(ctx: Context): undefined;
	}

	import type { Load } from "@sveltejs/kit";

	export const load: Load = async ({ page, fetch }) => {
		const { id } = page.params;

		const request = await fetch(`/api/sketches/${id}.json`);

		if (request.ok) {
			const data = await request.json();
			return {
				props: { ...data },
			};
		}

		return {
			status: request.status,
			error: new Error("failed to load sketch"),
		};
	};
</script>

<script lang="ts">
	import { slide } from "svelte/transition";
	import { ArrowRightIcon, ChevronRightIcon } from "svelte-feather-icons";

	import { page } from "$app/stores";

	import CodeBlock from "$components/CodeBlock.svelte";
	import { onMount } from "svelte";
	import { siteName } from "$lib/consts";
	import Main from "$components/Main.svelte";

	export let name: string;
	export let brief: string;
	export let html: string;

	let sketch: Sketch;

	function getURL(relPath: string) {
		return new URL(relPath, import.meta.url).href;
	}

	$: id = $page.params.id;
	$: source = getURL(`../../data/sketches/${id}.js`);

	function run(drawFn, options) {
		options = options || {};

		const state = {
			t: null,
			dt: null,
			ctx: null,
			cvs: null,
		};

		const tick = (t) => {
			const ts = t / 1000;
			state.dt = Math.min(ts - state.t, 0.1);
			state.t = ts;

			drawFn(state);

			window.requestAnimationFrame(tick);
		};

		window.requestAnimationFrame((t) => {
			const { init, cvs } = options;

			state.t = t;
			state.dt = 0;

			if (cvs) {
				state.cvs = cvs;
			} else {
				state.cvs = document.querySelector("#sketch-canvas");
			}

			if (state.cvs == null) {
				console.error("No canvas to use!");
				return;
			}

			state.ctx = state.cvs.getContext("2d");

			if (init) {
				init(state);
			}

			window.requestAnimationFrame(tick);
		});
	}

	let showing = false;
	let container: HTMLDivElement;

	let sourceHeight: string;
	$: if (sourceHeight != null) {
		container.style.setProperty("--source-height", sourceHeight);
	}

	onMount(async () => {
		sketch = await import(source);

		run(sketch.draw, { init: sketch.init });

		const script = document.createElement("script");
		script.type = "module";

		const now = new Date().getTime();
		script.src = `${source}?reloadfix=${now}`;

		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
		};
	});
</script>

<svelte:head>
	<title>{name} - Sketch | {siteName}</title>
</svelte:head>

<Main intro={false}>
	<canvas id="sketch-canvas" width="800" height="800" />

	<div bind:this={container} class="source-code" class:showing>
		<button
			on:click={() => {
				showing = !showing;
			}}
		>
			View Source
			<i><ChevronRightIcon size="1x" /></i>
		</button>

		<div class="source" aria-hidden="true">
			<CodeBlock bind:height={sourceHeight} dataSrc={source} language="javascript" />
		</div>
	</div>

	<div class="docs">
		<h1>{name}</h1>
		<p>{brief}</p>

		{@html html}
	</div>
</Main>

<style lang="scss">
	:global(code) {
		font-family: Fira Code, Consolas, "Courier New", monospace;
	}

	canvas {
		user-select: none;

		background: hsl(60, 30%, 94%);
		box-shadow: 0 0 8px var(--color-shadow);
	}

	canvas,
	.source-code {
		display: block;
		margin: 0 auto;

		// Show full canvas when at the top of the page.
		--visible-area: calc(0.9 * (100vh - var(--header-height) - 1rem));
		width: min(100%, var(--visible-area));
	}

	.source-code {
		button {
			cursor: pointer;

			width: 100%;
			border: 0;
			background: var(--color-bg-secondary);
			color: var(--color-fg-secondary);

			font-size: 1rem;
			padding: 1em;

			display: flex;
			flex-flow: row nowrap;
			align-items: center;
			justify-content: center;
			gap: 1em;

			border-bottom: thin solid transparent;
			border-top: thin solid transparent;
			transition: border-color 500ms ease-in;

			&:hover,
			&:active {
				filter: brightness(1.05);
			}

			i {
				transition: transform 100ms linear;
				display: inline-block;
				height: 1em;
			}
		}

		.source {
			height: auto;
			max-height: 0;
			overflow: hidden;

			transition: max-height 500ms ease-in;
		}

		&.showing {
			button {
				position: sticky;
				top: calc(var(--header-height));
				border-color: var(--color-bg-primary);

				i {
					transform: rotate(90deg);
				}
			}

			> .source {
				max-height: var(--source-height);
			}
		}
	}
</style>
