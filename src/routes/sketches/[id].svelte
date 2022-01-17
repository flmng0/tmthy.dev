<script lang="ts" context="module">
	import type { Sketch } from "$lib/sketch";
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

	// Run a given sketch with a specified canvas.
	//
	// Returns an object which constantly stores the latest animation request ID.
	// This is possibly a reduncancy.
	function runSketch(sketch: Sketch, cvs: HTMLCanvasElement): { latestRequest: number } {
		if (sketch.draw === undefined) {
			throw new Error("Sketch has no draw method defined...");
		}

		const state = {
			t: undefined,
			dt: undefined,
			ctx: undefined,
			cvs: undefined,
		};
		const output = { latestRequest: undefined };

		const tick: FrameRequestCallback = (t) => {
			const ts = t / 1000;
			state.dt = Math.min(ts - state.t, 0.1);
			state.t = ts;

			sketch.draw(state);

			output.latestRequest = window.requestAnimationFrame(tick);
		};

		output.latestRequest = window.requestAnimationFrame((t) => {
			state.t = t;
			state.dt = 0;
			state.cvs = cvs;
			state.ctx = state.cvs.getContext("2d");

			sketch.init && sketch.init(state);

			output.latestRequest = window.requestAnimationFrame(tick);
		});

		return output;
	}
</script>

<script lang="ts">
	import { ChevronRightIcon } from "svelte-feather-icons";

	import { page } from "$app/stores";

	import CodeBlock from "$components/CodeBlock.svelte";
	import { siteName } from "$lib/consts";
	import Main from "$components/Main.svelte";

	export let name: string;
	export let brief: string;
	export let html: string;

	let source: string;

	let sourceShowing = false;
	let container: HTMLDivElement;

	let sourceHeight: string;
	$: sourceHeight && container.style.setProperty("--source-height", sourceHeight);

	function loaded(cvs: HTMLCanvasElement) {
		const base = location.origin;
		const path = `sketches/${$page.params.id}.js`;
		const fix = new Date().getTime();

		source = `${base}/${path}?reloadfix=${fix}`;

		let runOut: { latestRequest: number };
		import(/* @vite-ignore */ source).then((s: Sketch) => {
			runOut = runSketch(s, cvs);
		});

		return {
			destroy() {
				if (runOut?.latestRequest !== undefined) {
					window.cancelAnimationFrame(runOut.latestRequest);
				}
			},
		};
	}
</script>

<svelte:head>
	<title>{name} - Sketch | {siteName}</title>
</svelte:head>

<Main intro={false}>
	<canvas use:loaded width="800" height="800" />

	<div bind:this={container} class="source-code" class:showing={sourceShowing}>
		<button
			on:click={() => {
				sourceShowing = !sourceShowing;
			}}
		>
			View Source
			<i><ChevronRightIcon size="1x" /></i>
		</button>

		<div class="source" aria-hidden="true">
			{#if source}
				<CodeBlock bind:height={sourceHeight} dataSrc={source} language="javascript" />
			{/if}
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
