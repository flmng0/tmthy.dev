<script lang="ts">
	import { GithubIcon, MenuIcon, MoonIcon, SunIcon, XIcon } from 'svelte-feather-icons'
	import { onMount, SvelteComponent } from 'svelte'
	import { slide } from 'svelte/transition'

	import { featherIconSize, themes } from '$lib/consts'
	import { theme } from '$lib/stores'

	interface Page {
		name: string
		href: string
	}

	const pages: Array<Page> = [
		{ name: 'Home', href: '/' },
		{ name: 'Projects', href: '/projects' },
		{ name: 'Sketches', href: '/sketches' },
	]

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
		<section class="header-middle">
			{#if width > 800}
				<nav class="desktop-nav">
					{#each pages as page}
						<a href={page.href}>{page.name}</a>
					{/each}
				</nav>
			{/if}
		</section>

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

			{#if width <= 800}
				<div class="mobile-nav">
					<button
						class="mobile-nav--button"
						on:click|stopPropagation={() => {
							mobileNavOpen = !mobileNavOpen
						}}
						bind:this={mobileNavButton}
					>
						{#if mobileNavOpen}
							<XIcon size={featherIconSize} />
						{:else}
							<MenuIcon size={featherIconSize} />
						{/if}
					</button>
					{#if mobileNavOpen}
						<nav class="mobile-nav--container">
							{#each pages as page}
								<a href={page.href}>{page.name}</a>
							{/each}
						</nav>
					{/if}
				</div>
			{/if}
		</section>
	</div>
</header>

<style lang="scss">
	.mobile-nav {
		position: relative;

		// background: var(--color-bg-primary);

		&--button {
			background: var(--color-bg-primary);
		}

		&--container {
			background: var(--color-bg-primary);

			display: flex;
			flex-flow: column wrap;

			position: absolute;
			top: 100%;
			right: 0;

			width: 20ch;
			box-shadow: 0 2px 8px 0 var(--color-shadow);

			& > a {
				background: none;
				margin: 0;
				padding: 0.8rem 1.2rem;

				&:hover {
					opacity: 1;
					background: var(--color-bg-secondary);
				}
			}
		}
	}

	header {
		// Just incase
		z-index: 10;

		position: sticky;
		top: 0;

		font-size: 1rem;

		padding: 0 0.5em;
		margin-bottom: 1rem;

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

	nav {
		display: flex;
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
