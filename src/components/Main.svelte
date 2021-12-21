<script lang="ts">
	import { fly } from "svelte/transition";

	export let intro = true;
</script>

{#if intro}
	<main in:fly={{ x: 1000 }}>
		<slot />
	</main>
{:else}
	<main>
		<slot />
	</main>
{/if}

<style lang="scss">
	main {
		width: min(100%, 60rem);
		margin: 1em auto;
		padding: 0 2em;
	}
</style>
