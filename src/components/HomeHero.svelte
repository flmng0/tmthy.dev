<script lang="ts">
	import { start, goHome } from "../lib/home-hero.ts";

	let canvas: HTMLCanvasElement;

	let ready: boolean = $state(false);

	let size = $state({ width: 0, height: 0 });

	let hover = $state(false);
	let far = $state(false);

	const setHover = (h: boolean) => (hover = h);

	const setFar = (f: boolean) => (far = f);

	$effect(() => {
		start(canvas, setHover, setFar).then(() => (ready = true));

		size.width = canvas.width;
		size.height = canvas.height;

		window.addEventListener("resize", () => {
			size.width = canvas.width;
			size.height = canvas.height;
		});
	});
</script>

<canvas bind:this={canvas} class:ready class:hover></canvas>

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

	canvas {
		touch-action: none;
	}

	canvas.ready {
		animation-fill-mode: forwards;
		animation-name: fadeIn;
		animation-delay: 0;
		animation-duration: 0.5s;
		animation-timing-function: ease-in;
	}

	canvas.hover {
		cursor: pointer;
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
		font-family: "Courier New", Courier, monospace;

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
