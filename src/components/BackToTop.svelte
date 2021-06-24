<script lang="ts">
	import { onMount } from 'svelte'
	import { fade } from 'svelte/transition'
	import { ArrowUpIcon } from 'svelte-feather-icons'

	// FIXME: For some reason this file isn't recognising any imports at all
	// from $lib. It works with other alias though...
	//
	// import { featherIconSize } from '$lib/consts'
	// export let iconSize: string = featherIconSize

	export let minFromTop: number = 50
	export let iconSize: string = '1.5x'
	export let duration: number = 250

	export let target: Element
	let y: number

	function gotoTop() {
		target.scrollIntoView()
	}

	onMount(() => {
		if (!target) {
			target = document.body
		}
	})
</script>

<svelte:window bind:scrollY={y} />

{#if y >= minFromTop}
	<button transition:fade={{ duration }} on:click={gotoTop}>
		<ArrowUpIcon size={iconSize} />
	</button>
{/if}

<style lang="scss">
	button {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		background-color: var(--color-bg-secondary);

		border: 0;
		box-shadow: 0 2px 5px var(--color-shadow);
		color: var(--color-fg-primary);
		border-radius: 50%;
		padding: 1em;

		&:hover {
			background-color: var(--color-bg-primary);
			color: var(--color-fg-primary);
		}
	}
</style>
