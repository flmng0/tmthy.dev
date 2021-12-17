<script lang="ts">
	import { onMount } from 'svelte'

	import BackToTop from '$components/BackToTop.svelte'
	import NavBar from '$components/NavBar.svelte'

	import { theme } from '$lib/stores'

	onMount(() => {
		document.body.setAttribute('data-theme', $theme)
	})
</script>

<NavBar />

<BackToTop />

<slot />

<style lang="scss">
	:global {
		* {
			box-sizing: border-box;
		}

		:root {
			font-size: 16px;

			--header-height: 5rem;
			scroll-padding-top: calc(var(--header-height) + 1rem);

			--content-max: 1000px;
			--content-width: min(100%, var(--content-max));

			scroll-behavior: smooth;
			--transition-duration: 250ms;
			--transition-function: ease-out;
			--transition: var(--transition-duration) var(--transition-function);
		}

		@media screen and (max-width: 400px) {
			:root {
				font-size: 4vw; // (16 / 400)vw
			}
		}

		body {
			font-family: Roboto, sans-serif;

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

			::selection {
				background-color: hsl(325, 45%, 60%);
			}
		}

		body[data-theme='light'] {
			--color-main: hsl(121, 50%, 55%);
			--color-accent: hsl(0, 0%, 60%);

			--color-bg-primary: hsl(0, 0%, 90%);
			--color-bg-secondary: hsl(0, 0%, 80%);

			--color-fg-primary: hsl(0, 0%, 10%);
			--color-fg-secondary: hsl(0, 0%, 20%);

			--color-shadow: hsla(0, 0%, 15%, 30%);

			::selection {
				background-color: hsl(121, 32%, 71%);
			}
		}

		a {
			color: currentColor;
		}

		body > main {
			width: min(100%, 60rem);
			margin: 1em auto;
		}
	}
</style>
