<script>
	import { onMount } from 'svelte'

	import { fade } from 'svelte/transition'

	export let items
	export let transitionType = fade
	export let transitionOptions = { duration: 750 }
	export let interval = 500

	let current = 0
	let showing = false

	function shown() {
		setTimeout(() => {
			showing = false
		}, interval)
	}

	function next() {
		current = (current + 1) % items.length
		showing = true
	}

	onMount(() => {
		showing = true
	})
</script>

{#if showing}
	<span transition:transitionType={transitionOptions} on:introend={shown} on:outroend={next}>
		{items[current]}
	</span>
{/if}
