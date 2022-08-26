<script lang="ts">
	import { onMount } from 'svelte'

	import { fade } from 'svelte/transition'

	import TextRotator from '$lib/TextRotator.svelte'
	import ThemeButton from '$lib/ThemeButton.svelte'
	import Hero from '$lib/home/Hero.svelte'
	import displays from '$lib/home/displays'
	import site from '$lib/site'

	const keys = Object.keys(displays)
	let index = 0

	$: key = keys[index]

	let display = displays[key]
	$: display = displays[key]

	const rotateInterval = 4500

	let iconSize = 400

	function rotateDisplays(node: HTMLElement) {
		let timeout: number

		const resetTimeout = () => {
			window.clearTimeout(timeout)
			timeout = window.setTimeout(() => {
				rotate()
			}, rotateInterval)
		}

		const rotate = () => {
			index = 1 + (index % (keys.length - 1))

			resetTimeout()
		}

		window.addEventListener('keypress', (e) => {
			const target = e.target as Element
			if (e.key === ' ' && target.contains(node)) {
				rotate()
			}
		})

		resetTimeout()
	}

	const setSize = () => {
		if (typeof window === 'undefined') {
			return
		}
		const width = window.innerWidth
		const height = window.innerHeight

		iconSize = Math.min(400, width * 0.8, height * 0.8)
	}

	onMount(() => {
		setSize()
	})
</script>

<svelte:window on:resize={setSize} />

<svelte:head>
	<title>Home | {site.name}</title>
</svelte:head>

<header use:rotateDisplays>
	<section class="icon">
		<Hero bind:icon={display.icon} size={iconSize} />
	</section>
	<section class="text">
		<p class="white">Hello! I'm Tim Davis.</p>
		<TextRotator text={display.text} />
	</section>
</header>

<style lang="scss">
	header {
		background-color: var(--col-header-bg);
		font-size: 1rem;

		width: 100vw;
		height: 100vh;

		position: relative;

		isolation: isolate;

		.icon {
			position: absolute;
			inset: 0;

			z-index: -1;
		}

		.text {
			font-size: 2em;

			position: absolute;
			color: var(--col-main);

			z-index: 1;

			width: max-content;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);

			&::after {
				content: '';
				display: block;
				position: absolute;
				inset: 0;
			}
		}

		.white {
			color: var(--col-primary-fg);
		}
	}
</style>
