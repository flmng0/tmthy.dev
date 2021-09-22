<script lang="ts">
	export let flags = {}
</script>

<main {...flags}>
	<slot />
</main>

<style lang="scss">
	main {
		margin: 0 auto;

		width: var(--content-width);
		padding: 1em 2em;
	}
</style>
