<script lang="ts">
	import SiteNav from '$lib/SiteNav.svelte'
</script>

<SiteNav />

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
