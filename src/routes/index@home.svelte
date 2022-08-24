<script lang="ts">
	import { browser } from '$app/env'
	import TextRotator from '$lib/TextRotator.svelte'

	import { onMount } from 'svelte'
	import { fade } from 'svelte/transition'
	import Hero from '$lib/home/Hero.svelte'
	import { displays } from '$lib/home/icons'
	import Navigation from '$lib/home/Navigation.svelte'

	const keys = Object.keys(displays)
	let index = 0

	$: key = keys[index]

	let display = displays[key]
	$: display = displays[key]

	const rotateInterval = 5000

	let iconSize = 400

	function rotateDisplays(node: HTMLElement) {
		setInterval(() => {
			if (index == keys.length - 1) {
				index = 1
			} else {
				index = (index + 1) % keys.length
			}
		}, rotateInterval)
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

<header in:fade={{ delay: 500, duration: 1000 }} use:rotateDisplays>
	<Navigation />
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
		background: var(--col-shadow);
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

			$bg: var(--col-hero-bg, #0008);
			background-color: $bg;

			text-shadow: 0 0 0.2em #000;

			width: max-content;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);

			&::after {
				content: '';
				display: block;
				position: absolute;
				inset: 0;
				box-shadow: 0 0 0 100vmax $bg;
			}
		}

		.white {
			color: var(--col-primary-fg);
		}
	}
</style>
