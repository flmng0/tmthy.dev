<script lang="ts">
	import Navigation from '$lib/Navigation.svelte'
	// Styles
	import '@fontsource/fira-code/400.css'
	import '@fontsource/fira-code/variable.css'
	import '@fontsource/open-sans/400.css'
	import '@fontsource/open-sans/variable.css'
	// Fonts
	import '@fontsource/roboto-flex/400.css'
	import '@fontsource/roboto-flex/variable.css'

	import '$lib/global.scss'
</script>

<Navigation />
<slot />
