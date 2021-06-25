<script lang="ts">
	import type { SvelteComponent } from 'svelte'
	import { MoonIcon, SunIcon } from 'svelte-feather-icons'

	import { featherIconSize } from '$lib/consts'

	interface ThemeButton {
		name: string
		icon: typeof SvelteComponent
	}

	const themes: Array<ThemeButton> = [
		{ name: 'dark', icon: MoonIcon },
		{ name: 'light', icon: SunIcon },
	]

	let current = themes[0].name
	$: document.body.setAttribute('data-theme', current)

	function clickEvent(theme: ThemeButton) {
		return () => {
			current = theme.name
		}
	}
</script>

<nav class="picker">
	{#each themes as theme}
		<button
			class:current={theme.name == current}
			on:click={clickEvent(theme)}
			title={`Switch to the ${theme.name} theme`}
		>
			<svelte:component this={theme.icon} size={featherIconSize} />
		</button>
	{/each}
</nav>

<style lang="scss">
	.picker {
		overflow: hidden;

		--border-radius: 1rem;
		border-radius: var(--border-radius);
		border: 2px solid var(--color-bg-primary);
	}

	button {
		border: none;

		padding: 0.8em 1em;

		background-color: var(--color-bg-secondary);
		color: currentColor;
		cursor: pointer;

		&:hover {
			filter: brightness(1.05);
		}

		&:first-child {
			border-top-left-radius: var(--border-radius);
			border-bottom-left-radius: var(--border-radius);
		}

		&:last-child {
			border-top-right-radius: var(--border-radius);
			border-bottom-right-radius: var(--border-radius);
		}

		&.current {
			box-shadow: inset 0 0 3px 0 var(--color-shadow);
			background-color: var(--color-bg-primary);
		}

		& + & {
			border-left: 2px solid var(--color-bg-primary);
		}
	}
</style>
