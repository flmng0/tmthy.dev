<script lang="ts">
	import { onMount, tick } from 'svelte'
	import { slide } from 'svelte/transition'

	export let open: boolean = false
	export let button: Element

	function maybeClose(e: Event) {
		if (e.target != button) {
			open = false
		}
	}

	function toggle(e: MouseEvent) {
		if (e) {
			e.stopPropagation()
		}
		open = !open
	}

	onMount(async () => {
		await tick()
		const listener = button.addEventListener('click', toggle)

		return () => {
			button.removeEventListener('click', toggle)
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
