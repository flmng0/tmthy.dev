<script lang="ts">
	import { theme } from '$lib/stores'
	import FeatherIcon from './FeatherIcon.svelte'

	const toggleTheme = () => {
		theme.update((t) => (t === 'dark' ? 'light' : 'dark'))
	}
</script>

<button class="theme" on:click={toggleTheme}>
	<FeatherIcon key={$theme === 'dark' ? 'sun' : 'moon'} width="1.3em" height="1.3em" />
</button>

<style>
	.theme {
		all: unset;
	}
</style>
