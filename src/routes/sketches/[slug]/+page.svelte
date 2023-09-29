<script>
	import { onMount } from 'svelte';

	export let data;

	let canvas;

	onMount(() => {
		const startEvent = new CustomEvent('startsketch', { detail: canvas });
		document.dispatchEvent(startEvent);

		return () => {
			const stopEvent = new Event('stopsketch');
			document.dispatchEvent(stopEvent);
		};
	});
</script>

<svelte:head>
	<script src={data.scriptSrc} type="module" defer></script>
</svelte:head>

<canvas width="800" height="800" bind:this={canvas} id="sketchCanvas" />

<main>
	<svelte:component this={data.writeup.component} />
</main>
