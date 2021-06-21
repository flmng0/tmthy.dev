<script>
	import { onMount, tick } from 'svelte'

	import { slide } from 'svelte/transition'

	export let open = false
	export let button

	function maybeClose(e) {
		if (e.target != button) {
			open = false
		}
	}

	onMount(async () => {
		await tick()
		const listener = button.addEventListener('click', (e) => {
			e.stopPropagation()
			open = !open
		})

		return () => {
			button.removeEventListener(listener)
		}
	})
</script>

<svelte:body on:click={maybeClose} />

<div class="dropdown">
	<slot />
	{#if open}
		<div class="dropdown__items">
			<slot name="dropdown-items" />
		</div>
	{/if}
</div>

<style lang="scss">
	.dropdown {
		position: relative;

		&__items {
			position: absolute;
			top: 100%;
		}
	}
</style>
