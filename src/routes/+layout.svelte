<script lang="ts">
	import SiteNav from '$lib/SiteNav.svelte'

	// Styles
	import '$lib/global.scss'

	// Fonts
	import '@fontsource/roboto-flex/400.css'
	import '@fontsource/roboto-flex/variable.css'
	import '@fontsource/fira-code/400.css'
	import '@fontsource/fira-code/variable.css'
	import '@fontsource/open-sans/400.css'
	import '@fontsource/open-sans/variable.css'
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
