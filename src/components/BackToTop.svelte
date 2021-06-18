<script>
	import { fade } from 'svelte/transition'

	import { ArrowUpIcon } from 'svelte-feather-icons'

	import { featherIconSize } from '$lib/consts'

	export let minFromTop = 50
	export let iconSize = featherIconSize
	export let duration = 250
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

		:global(.feather) {
			stroke: currentColor;
		}
	}
</style>
