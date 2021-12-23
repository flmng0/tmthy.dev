<script lang="ts">
	import Hero from "$components/index/Hero.svelte";
	import { siteName } from "$lib/consts";
	import { onMount } from "svelte";
	import { quintOut } from "svelte/easing";
	import { fly } from "svelte/transition";

	let start = null;
	onMount(() => {
		start = {};
	});
</script>

<svelte:head>
	<title>{siteName}</title>
</svelte:head>

<Hero />

{#if start}
	<p in:fly={{ delay: 3000, duration: 1000, easing: quintOut, x: -200 }} class="wip-text">
		This site is currently in development, but you can follow its progress on
		<a href="https://github.com/flmng0/flmng0.github.io">GitHub</a>.
	</p>
{/if}

<style lang="scss">
	.wip-text {
		position: fixed;
		bottom: 5em;
		font-size: 1.2em;
		font-weight: 200;

		left: 50%;
		transform: translateX(-50%);

		width: min(100%, 30ch);
		color: var(--color-fg-secondary);

		a {
			color: var(--color-main);
		}
	}
</style>
