<script lang="ts">
	import { GithubIcon, MenuIcon, MoonIcon, SunIcon, XIcon } from 'svelte-feather-icons'
	import { onMount, SvelteComponent } from 'svelte'
	import { slide } from 'svelte/transition'

	import { featherIconSize, themes } from '$lib/consts'
	import { theme } from '$lib/stores'

	let currentTheme: number = 0

	function toggleTheme() {
		currentTheme = (currentTheme + 1) % themes.length
		$theme = themes[currentTheme].name
	}

	onMount(() => {
		currentTheme = themes.findIndex((item) => item.name == $theme)

		theme.subscribe((theme) => {
			document.body.setAttribute('data-theme', theme)
		})
	})

	let width: number

	let mobileNavButton: Element
	let mobileNavOpen: boolean = false

	const maybeCloseMobileNav = (e) => {
		if (e.target != mobileNavButton) {
			mobileNavOpen = false
		}
	}
</script>

<svelte:body on:click={maybeCloseMobileNav} />
<svelte:window bind:innerWidth={width} />

<header class="page-nav">
	<div class="inner">
		<!-- Left -->
		<section class="header-left">
			<h1><a href="/">tmthydvs.dev</a></h1>
		</section>

		<!-- Middle -->
		<section class="header-middle" />

		<!-- Right -->
		<section class="header-right">
			<!-- Theme Picker -->
			<button on:click={toggleTheme} title="Toggle current site theme">
				<svelte:component this={themes[currentTheme].icon} size={featherIconSize} />
			</button>
			<!-- Link to my GitHub user page -->
			<a href="https://github.com/flmng0" target="_blank">
				<GithubIcon size={featherIconSize} />
			</a>
		</section>
	</div>
</header>

<style lang="scss">
	header {
		// Just incase
		z-index: 10;

		position: sticky;
		top: 0;

		font-size: 1rem;

		padding: 0 0.5em;

		width: 100%;
		height: var(--header-height);

		--header-bg: var(--color-bg-secondary);

		background-color: var(--color-bg-secondary);
	}

	h1 {
		font-size: 1.25rem;
	}

	a {
		text-decoration: none;
	}

	a,
	button {
		border: 0;
		font-size: inherit;

		line-height: normal;
		padding: 0.5em 0.6em;
		margin: 0 0.5em;

		background-color: var(--header-bg, inherit);
		color: currentColor;
		cursor: pointer;

		transition: opacity 100ms var(--transition-function);
		&:hover {
			opacity: 0.6;
		}
	}

	.inner {
		// Uses grid instead of flex (and justify: space-between), so that
		// the navigation items are actually centered on the screen.
		display: grid;
		grid-template-columns: 1fr 2.5fr 1fr;

		margin: 0 auto;

		width: var(--content-width);
		height: 100%;
	}

	.header-left {
		justify-self: flex-start;
	}
	.header-middle {
		justify-self: center;
	}
	.header-right {
		justify-self: flex-end;
	}

	section {
		height: var(--header-height);
		display: flex;
		align-items: center;
	}
</style>
