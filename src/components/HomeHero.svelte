<script lang="ts">
	import { start, goHome } from "../lib/home-hero.ts";
	import { type Link } from "../lib/globals.ts";

	let canvas: HTMLCanvasElement;

	let ready: boolean = $state(false);

	let pointer = $state({ x: 0, y: 0 });

	let link = $state<Link>();

	let far = $state(false);

	const setLink = (l: Link) => (link = l);
	const setFar = (f: boolean) => (far = f);

	$effect(() => {
		start(canvas, setLink, setFar).then(() => (ready = true));
	});
</script>

<canvas
	onpointermove={(e) => (pointer = e)}
	onpointerup={(e) => (pointer = e)}
	bind:this={canvas}
	class:pointer={link}
	class:ready
>
</canvas>

{#if link?.name}
	<span
		class="hover-title"
		style:--x={pointer?.x + "px"}
		style:--y={pointer?.y + "px"}
	>
		{link.name}
	</span>
{/if}

<button class="home" class:far onclick={goHome}>Go Home!</button>

<style>
	@keyframes fadeIn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	.hover-title,
	.home {
		font-family: "Courier New", Courier, monospace;
	}

	.hover-title {
		position: absolute;
		display: inline-block;
		left: var(--x);
		top: var(--y);
		translate: -50% 50%;
		background: black;
		color: white;
		padding: 0.5em 0.8em;
		z-index: 1;
		pointer-events: none;
	}

	canvas {
		touch-action: none;
		z-index: 0;
	}

	canvas.pointer {
		cursor: pointer;
	}

	canvas.ready {
		animation-fill-mode: forwards;
		animation-name: fadeIn;
		animation-delay: 0;
		animation-duration: 0.5s;
		animation-timing-function: ease-in;
	}

	.home {
		cursor: pointer;
		position: fixed;
		bottom: 0;
		right: 0;
		margin: 1em;
		padding: 0.4em 0.6em;
		background: black;
		color: white;

		font-size: 1.5rem;

		border: unset;
		--shadow: 4px;
		box-shadow: var(--shadow) var(--shadow) 0 0 #888888;

		transition: opacity 700ms;
		pointer-events: none;
		opacity: 0;
	}

	.home:hover {
		background: white;
		color: black;
	}

	.home:active {
		transform: translate(2px, 2px);
		--shadow: 1px;
	}

	.home.far {
		pointer-events: initial;
		opacity: 1;
	}
</style>
