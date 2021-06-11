<script>
	import { fade } from 'svelte/transition'

	import { ArrowUpIcon } from 'svelte-feather-icons'

	import { featherIconSize, transitionDuration } from './consts'

	export let minFromTop = 50
	export let iconSize = featherIconSize
	export let duration = transitionDuration
	let y

	function gotoTop() {
		document.body.scrollIntoView()
	}
</script>

<svelte:window bind:scrollY={y} />

<!-- Wrapped inside a div, so that it keeps persistent layout -->
{#if y >= minFromTop}
	<button transition:fade={{ duration }} on:click={gotoTop}>
		<ArrowUpIcon size={iconSize} />
	</button>
{/if}

<style>
	button {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		background-color: var(--color-bg-secondary);

		border: 0;
		box-shadow: var(--value-shadow) var(--color-shadow);
		color: var(--color-fg-primary);
		border-radius: 50%;
		padding: 1em;
	}

	button:hover {
		background-color: var(--color-bg-primary);
		color: var(--color-fg-primary);
	}

	button :global(.feather) {
		stroke: currentColor;
	}
</style>
