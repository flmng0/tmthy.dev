<script lang="ts">
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import { ArrowUpIcon } from "svelte-feather-icons";

	import { featherIconSize } from "$lib/consts";

	export let minFromTop: number = 50;
	export let duration: number = 250;

	let y: number;

	function gotoTop() {
		document.body.scrollIntoView();
	}
</script>

<svelte:window bind:scrollY={y} />

{#if y >= minFromTop}
	<button transition:fade={{ duration }} on:click={gotoTop} title="Scroll to top">
		<ArrowUpIcon size={featherIconSize} />
	</button>
{/if}

<style lang="scss">
	button {
		cursor: pointer;

		font-size: 1rem;

		z-index: 10;

		position: fixed;
		bottom: 1rem;
		right: 1rem;

		padding: 1em;

		background-color: var(--color-bg-secondary);
		border: 0;
		box-shadow: 0 2px 5px var(--color-shadow);
		color: var(--color-fg-primary);
		border-radius: 50%;

		&:hover {
			background-color: var(--color-bg-primary);
			color: var(--color-fg-primary);
		}
	}
</style>
