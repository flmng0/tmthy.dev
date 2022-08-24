<script lang="ts">
	import { makeHorizontalDelay } from '$lib/actions'
	import { pages as allPages } from '$lib/site'

	import { onMount } from 'svelte'
	import { sineIn } from 'svelte/easing'
	import { fly } from 'svelte/transition'

	const pages = Object.entries(allPages).filter(([route]) => route !== '/')

	const delayFactor = 120
	const flyParams = (i: number) => ({
		x: -100,
		delay: i * delayFactor,
		duration: 300,
	})

	let intro = {}
	onMount(() => {
		intro = {}
	})
</script>

<nav class="home-nav">
	{#key intro}
		{#each pages as [href, name], i}
			<a {href} in:fly={flyParams(i)} class="unstyled">{name}</a>
		{/each}
	{/key}
</nav>

<style lang="scss">
	.home-nav {
		display: flex;
		flex-flow: row;
		gap: 1em;

		font-size: 1.2em;
		padding: 1em 0;

		position: absolute;

		width: 100%;
		justify-content: center;

		z-index: 2;

		a {
			text-decoration: none;
			border-bottom: 2px solid var(--col-secondary-bg);

			&:hover,
			&:focus-within {
				border-bottom-color: currentColor;
			}
		}
	}
</style>
