<script lang="ts" context="module">
	export type Page = {
		name: string;
		href: string;
	};
</script>

<script lang="ts">
	import { GithubIcon, MoonIcon, SunIcon } from "svelte-feather-icons";
	import { onMount, SvelteComponent } from "svelte";
	import { slide } from "svelte/transition";

	import MobileNav from "./MobileNav.svelte";

	import { featherIconSize, themes, siteName } from "$lib/consts";
	import { theme } from "$lib/stores";
	import { page } from "$app/stores";

	const pages: Page[] = [
		{ name: "Home", href: "/" },
		{ name: "Projects", href: "/projects" },
		{ name: "Sketches", href: "/sketches" },
	];

	let currentTheme: number = 0;

	function toggleTheme() {
		currentTheme = (currentTheme + 1) % themes.length;
		$theme = themes[currentTheme].name;
	}

	onMount(() => {
		currentTheme = themes.findIndex((item) => item.name == $theme);

		theme.subscribe((theme) => {
			document.body.setAttribute("data-theme", theme);
		});
	});

	let width: number;

	const minMobileWidth = 800;
</script>

<svelte:window bind:innerWidth={width} />

<header class="page-nav">
	<div class="inner">
		<!-- Left -->
		<section class="header-left">
			<h1><a href="/">{siteName}</a></h1>
		</section>

		<!-- Middle -->
		<section class="header-middle">
			{#if width > minMobileWidth}
				{#each pages as p}
					<a href={p.href} aria-current={$page.path == p.href || null}>{p.name}</a>
				{/each}
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

			{#if width <= minMobileWidth}
				<MobileNav {pages} />
			{/if}
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
		box-shadow: 0 0 8px 2px var(--color-shadow);
	}

	section > :global(*) {
		margin: 0 0.5em;
	}

	h1 {
		font-size: 1.25rem;
		font-weight: 400;
		letter-spacing: 0.06em;
	}

	a,
	button {
		cursor: pointer;

		border: 0;
		font-size: inherit;

		padding: 0.5em 0.6em;
		line-height: normal;

		background-color: var(--header-bg, inherit);
		color: currentColor;

		transition: opacity 100ms var(--transition-function);
		&:hover {
			opacity: 0.6;
		}
	}

	a {
		text-decoration: none;
		border-bottom: thin solid transparent;

		&[aria-current] {
			border-color: currentColor;
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
