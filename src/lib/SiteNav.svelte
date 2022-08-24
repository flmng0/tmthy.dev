<script lang="ts">
	import { page } from '$app/stores'

	import { onMount } from 'svelte'
	import { sineIn } from 'svelte/easing'
	import { tweened } from 'svelte/motion'

	import FeatherIcon from '$lib/FeatherIcon.svelte'

	import { pages } from '$lib/site'
	import ThemeButton from '$lib/ThemeButton.svelte'
	import { makeHorizontalDelay } from '$lib/actions'

	export let openMargin: number | null = 50

	const hueOffset = tweened(0, {
		duration: 500,
		easing: sineIn,
	})
	let lastScroll: number = 0
	let scrollY: number

	let hidden: boolean = false

	$: if (openMargin === null) {
		hidden = false
	} else {
		const dy = scrollY - lastScroll

		hidden = scrollY > openMargin && dy >= 0
		lastScroll = scrollY
	}

	$: $hueOffset = hidden ? 180 : 0

	let totalDuration: number

	const horizontalDelay = makeHorizontalDelay((duration) => {
		totalDuration = duration
	})
</script>

<svelte:window bind:scrollY />

<nav class:hidden style:--hue-offset="{$hueOffset}deg" style:--max-delay="{totalDuration}ms">
	<section class="page-links">
		{#each Object.entries(pages) as [link, name]}
			{@const href = $page.url.pathname === link ? '#' : link}

			<a {href} use:horizontalDelay>{name}</a>
		{/each}
	</section>

	<section class="buttons">
		<span use:horizontalDelay>
			<ThemeButton />
		</span>
	</section>
</nav>

<style lang="scss">
	nav {
		position: sticky;
		top: 0;

		z-index: 10;

		padding: 1em 1.5em;
		font-size: 1rem;

		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		align-items: center;

		overflow: hidden;

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

		> section > * {
			transition: transform 70ms ease-out, opacity 50ms linear;
			transition-delay: var(--delay);
			transform: translateY(0);
			opacity: 1;
		}

		&::after {
			content: '';
			position: absolute;
			inset: 0;
			background-color: var(--col-shadow);

			z-index: -1;
		}

		&::after {
			transition: transform 100ms ease-in;
			transform: translateY(0);
		}

		&.hidden {
			&::after,
			& > section > * {
				transform: translateY(-100%);
			}

			&::after {
				transition-delay: var(--max-delay);
			}
			> section > * {
				opacity: 0;
			}
		}
	}

	.page-links {
		display: flex;
		flex-flow: row nowrap;
		gap: 0.7em;

		a {
			text-decoration: none;
			font-weight: 300;
			font-size: 1em;

			&[href='#'] {
				font-weight: 400;
				text-decoration: underline;
			}
		}
	}
</style>
