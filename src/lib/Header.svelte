<script lang="ts">
	import { page } from '$app/stores'

	import { onMount } from 'svelte'
	import { sineIn } from 'svelte/easing'
	import { tweened } from 'svelte/motion'

	import FeatherIcon from './FeatherIcon.svelte'

	const pages = {
		'/': 'Home',
		'/sketches': 'Sketches',
		'/projects': 'Projects',
		'/contact': 'Contact',
	}

	let theme = 'dark'
	const toggleTheme = () => {
		theme = theme === 'dark' ? 'light' : 'dark'
	}

	const openMargin = 200
	const hueOffset = tweened(0, {
		duration: 500,
		easing: sineIn,
	})
	let lastScroll: number = 0
	let scrollY: number

	let hidden: boolean = false

	$: {
		const dy = scrollY - lastScroll

		hidden = scrollY > openMargin && dy >= 0
		lastScroll = scrollY
	}

	$: $hueOffset = hidden ? 180 : 0

	let totalDuration = 0
	const delayScale = 400
	let delayQueue: HTMLElement[] = []

	function horizontalDelay(elem: HTMLElement) {
		const rect = elem.getBoundingClientRect()

		// Pre-sorting
		const i = delayQueue.findIndex((item) => item.getBoundingClientRect().left > rect.left)
		if (i === -1) {
			delayQueue = [...delayQueue, elem]
		} else {
			delayQueue = [...delayQueue.slice(0, i), elem, ...delayQueue.slice(i)]
		}
	}

	onMount(() => {
		const easing = sineIn
		const delay = (t: number) => easing(t) * delayScale

		delayQueue.forEach((elem, i) => {
			const t = i / delayQueue.length

			elem.style.setProperty('--delay', delay(t) + 'ms')
		})

		totalDuration = delay(delayQueue.length)
	})
</script>

<svelte:window bind:scrollY />

<header>
	<h1>
		<a href="/">tmthy.dev</a>
	</h1>
</header>

<nav class:hidden style:--hue-offset="{$hueOffset}deg" style:--max-delay="{totalDuration}ms">
	<section class="page-links">
		{#each Object.entries(pages) as [link, name]}
			{@const href = $page.url.pathname === link ? '#' : link}

			<a {href} use:horizontalDelay>{name}</a>
		{/each}
	</section>

	<section class="buttons">
		<button use:horizontalDelay on:click={toggleTheme}>
			<FeatherIcon key={theme === 'dark' ? 'sun' : 'moon'} width="1.3em" height="1.3em" />
		</button>
	</section>
</nav>

<style lang="scss">
	button {
		all: unset;
	}

	header {
		background: var(--col-shadow);
		padding: 0.5em;
		font-size: 1.2em;
		text-align: center;
	}

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
