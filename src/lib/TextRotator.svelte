<script lang="ts">
	import { fade } from 'svelte/transition'

	export let text: string | null
	export let duration: number = 400
</script>

<div>
	{#key text}
		<span in:fade={{ duration, delay: duration }} out:fade={{ duration }}>
			{#if text}
				{text}
			{:else}
				&nbsp;
			{/if}
		</span>
	{/key}
</div>

<style lang="scss">
	div {
		display: grid;

		> * {
			grid-row: 1;
			grid-column: 1;
		}
	}
</style>
