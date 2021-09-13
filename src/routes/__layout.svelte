<script lang="ts">
	import { onMount, setContext } from 'svelte'
	import { fly } from 'svelte/transition'

	import { session, page } from '$app/stores'

	import BackToTop from '$components/BackToTop.svelte'
	import Hero from '$components/Hero.svelte'
	import NavBar from '$components/NavBar.svelte'
	import AvatarIntro from '$components/AvatarIntro.svelte'

	import { theme } from '$lib/stores'

	let container: Element

	onMount(() => {
		document.body.setAttribute('data-theme', $theme)
	})

	function mainLoaded() {
		const hash = window.location.hash

		if (hash.length > 0) {
			const elem = document.querySelector(hash)
			if (elem) {
				elem.scrollIntoView()
			}
		}
	}
</script>

{#if $session.introHasPlayed}
	{#if $page.path == '/'}
		<Hero target={container} />
	{/if}

	<NavBar />

	<BackToTop target={container} />

	<main bind:this={container} in:fly={{ x: -200, delay: 500 }} on:introend={mainLoaded}>
		<slot />
	</main>
{:else}
	<AvatarIntro />
{/if}

<style lang="scss">
	:global {
		* {
			box-sizing: border-box;
		}

		:root {
			font-size: 1rem;

			--header-height: 5rem;
			scroll-padding-top: calc(var(--header-height) + 1rem);

			--content-max: 800px;
			--content-width: min(100%, var(--content-max));

			scroll-behavior: smooth;
			--transition-duration: 250ms;
			--transition-function: ease-out;
			--transition: var(--transition-duration) var(--transition-function);
		}

		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
				Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

			margin: 0 auto;
			padding: 0;

			line-height: 1.5;

			background-color: var(--color-bg-primary);
			color: var(--color-fg-primary);

			transition: background-color var(--transition);
		}

		body,
		body[data-theme='dark'] {
			--color-main: hsl(325, 100%, 80%);
			--color-accent: hsl(122, 91%, 21%);

			--color-bg-primary: hsl(0, 0%, 10%);
			--color-bg-secondary: hsl(0, 0%, 20%);

			--color-fg-primary: hsl(0, 0%, 90%);
			--color-fg-secondary: hsl(0, 0%, 80%);

			--color-shadow: hsla(0, 0%, 0%, 100%);
		}

		body[data-theme='light'] {
			--color-main: hsl(0, 0%, 40%);
			--color-accent: hsl(0, 0%, 60%);

			--color-bg-primary: hsl(0, 0%, 90%);
			--color-bg-secondary: hsl(0, 0%, 80%);

			--color-fg-primary: hsl(0, 0%, 10%);
			--color-fg-secondary: hsl(0, 0%, 20%);

			--color-shadow: hsla(0, 0%, 15%, 60%);
		}

		a {
			color: currentColor;
		}

		body[data-theme='dark'] ::selection {
			background-color: hsl(325, 45%, 60%);
		}

		body[data-theme='light'] ::selection {
			background-color: hsl(121, 32%, 71%);
		}
	}

	main {
		margin: 0 auto;

		width: var(--content-width);
		padding: 1em 2em;
	}
</style>
