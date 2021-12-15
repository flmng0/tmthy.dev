<script lang="ts">
	import { onMount } from 'svelte'
	import { fade } from 'svelte/transition'
	import type { TransitionConfig } from 'svelte/transition'

	export let items: Array<string>
	export let transitionType: (node: Element, props: any) => TransitionConfig = fade
	export let transitionOptions: any = { duration: 750 }
	export let interval: number = 500
	export let initialDelay = 0

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
		setTimeout(() => {
			showing = true
		}, initialDelay)
	})
</script>

{#if showing}
	<span transition:transitionType={transitionOptions} on:introend={shown} on:outroend={next}>
		{items[current]}
	</span>
{/if}
