<script lang="ts">
	import { onMount } from 'svelte'

	import { fly } from 'svelte/transition'

	import { pages as allPages } from '$lib/site'

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

{#key intro}
	{#each pages as [href, name], i}
		<a {href} in:fly={flyParams(i)} class="unstyled">{name}</a>
	{/each}
{/key}

<style lang="scss">
	a {
		text-decoration: none;
		border-bottom: 2px solid var(--col-secondary-fg);

		&:hover,
		&:focus-within {
			border-bottom-color: currentColor;
		}
	}
</style>
