<script lang="ts">
	import FeatherIcon from './FeatherIcon.svelte'

	import { theme } from '$lib/stores'

	const toggleTheme = () => {
		theme.update((t) => (t === 'dark' ? 'light' : 'dark'))
	}
</script>

<button class="theme" on:click={toggleTheme}>
	<FeatherIcon key={$theme === 'dark' ? 'sun' : 'moon'} width="1.3em" height="1.3em" />
</button>

<style lang="scss">
	.theme {
		all: unset;
		cursor: pointer;

		color: var(--col-primary-fg);

		&:hover {
			color: var(--col-secondary-fg);
		}
	}
</style>
