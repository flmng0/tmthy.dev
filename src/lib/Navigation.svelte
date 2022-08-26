<script lang="ts">
	import { page } from '$app/stores'

	import { sineIn } from 'svelte/easing'
	import { tweened } from 'svelte/motion'

	import ThemeButton from '$lib/ThemeButton.svelte'
	import { makeHorizontalDelay } from '$lib/actions'
	import site from '$lib/site'
	import Logo from './Logo.svelte'
	import { onMount } from 'svelte'

	const openMargin = 50

	const hueOffset = tweened(0, {
		duration: 500,
		easing: sineIn,
	})
	let lastScroll: number = 0
	let scrollY: number

	let hidden: boolean = true

	const checkHidden = (scrollY: number) => {
		if (scrollY === undefined) return
		const dy = scrollY - lastScroll

		hidden = scrollY > openMargin && dy >= 0
		lastScroll = scrollY
	}

	$: checkHidden(scrollY)

	$: $hueOffset = hidden ? 180 : 0

	const totalDuration = 400

	const horizontalDelay = makeHorizontalDelay(totalDuration)

	const pages = Object.entries(site.pages)

	$: home = $page.url.pathname === '/'
	$: homeLink = home ? '#' : '/'
</script>

<svelte:window bind:scrollY />

<nav
	class="site-nav"
	class:home
	class:hidden
	style:--hue-offset="{$hueOffset}deg"
	style:--max-delay="{totalDuration}ms"
>
	<div class="inner">
		<section class="home-link">
			<a href={homeLink} class="has-delay" use:horizontalDelay>
				<div class="logo">
					<Logo />
				</div>
			</a>
		</section>

		<section class="page-links">
			{#each pages as [link, name], i}
				{@const href = $page.url.pathname === link ? '#' : link}

				<a {href} class="has-delay" use:horizontalDelay>{name}</a>
			{/each}
		</section>

		<section class="buttons">
			<span class="has-delay" use:horizontalDelay>
				<ThemeButton />
			</span>
		</section>
	</div>
</nav>

<style lang="scss">
	nav {
		position: sticky;
		top: 0;

		z-index: 10;

		width: 100%;

		&::after {
			content: '';
			position: absolute;
			inset: 0;
			background-color: var(--col-header-bg);

			z-index: -1;
			transition: transform 100ms ease-in;
			transform: translateY(0);
		}
		$border-size: 2;
		border-image: linear-gradient(
				to bottom right,
				hsl(calc(var(--hue-offset, 0deg) + 290deg), 100%, 50%),
				hsl(calc(var(--hue-offset, 0deg) + 320deg), 100%, 50%),
				hsl(calc(var(--hue-offset, 0deg) + 350deg), 100%, 50%)
			)
			$border-size;
		border-top-width: $border-size * 1px;
		border-top-style: solid;

		filter: drop-shadow(0 -2px 8px var(--col-shadow));
		transition: filter 200ms ease-in;

		overflow: hidden;

		.has-delay {
			transition: transform 70ms ease-out, opacity 50ms linear;
			transition-delay: var(--delay);
			transform: translateY(0);
			opacity: 1;
			display: block;
		}

		&.hidden {
			&::after,
			.has-delay {
				transform: translateY(-100%);
			}

			&::after {
				transition-delay: var(--max-delay);
			}
			.has-delay {
				opacity: 0;
			}
		}

		&.home {
			position: absolute;
			filter: unset;
		}
	}

	.inner {
		font-size: 1.1rem;
		padding: 1em 0.9em;

		display: grid;

		grid-template-columns: auto 1fr auto;
		gap: 0.5em;
		align-items: center;

		width: min(80ch, 100%);
		margin: 0 auto;
	}

	.home-link a,
	.page-links a {
		&:hover,
		&:focus-within,
		&[href='#'] {
			color: var(--col-main);
		}
	}

	.page-links {
		display: flex;
		flex-flow: row;
		gap: 1em;
		justify-content: start;
		margin-inline: 0.2em;

		a {
			text-decoration: none;
			border-bottom: 2px solid var(--col-secondary-bg);

			padding-inline: 0.05em;
			font-weight: 400;

			&:hover,
			&:focus-within,
			&[href='#'] {
				border-bottom-color: currentColor;
			}
		}
	}

	.home-link {
		> a {
			border-bottom: unset;
		}
		.logo {
			height: 2.5em;
		}
	}
</style>
