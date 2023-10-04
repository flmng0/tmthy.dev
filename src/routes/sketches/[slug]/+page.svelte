<script>
	import { browser } from '$app/environment';
	import { importSketch } from '$lib/sketch.js';
	import { onDestroy } from 'svelte';

	export let data;

	let canvas;
	let stopper;

	/**
	 * @param {string} slug
	 */
	async function runSketch(slug) {
		const sketch = await importSketch(slug);

		let start = 0;
		let animId = 0;
		let running = true;

		let state = sketch.init(canvas);

		const tick = (/** @type number */ t) => {
			sketch.draw(state, t - start);

			if (running) {
				animId = window.requestAnimationFrame(tick);
			}
		};

		animId = window.requestAnimationFrame((t) => {
			start = t;
			tick(t);
		});

		stopper = () => {
			running = false;
			cancelAnimationFrame(animId);
		};
	}

	$: if (browser) runSketch(data.slug);

	onDestroy(() => {
		stopper && stopper();
	});
</script>

<canvas width="800" height="800" bind:this={canvas} id="sketchCanvas" />

<main>
	<svelte:component this={data.writeup.component} />
</main>
