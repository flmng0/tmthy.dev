<script lang="ts">
	import Navigation from '$lib/Navigation.svelte'
</script>

<Navigation />

<article>
	<slot />
</article>

<style lang="scss">
	article {
		width: min(80ch, 100%);
		margin: 0 auto;
		padding: 2em;
	}
</style>
