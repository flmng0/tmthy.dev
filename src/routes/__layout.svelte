<script lang="ts">
	import { setContext } from 'svelte'
	import { fly } from 'svelte/transition'

	import { session, page } from '$app/stores'

	import BackToTop from '$components/BackToTop.svelte'
	import Hero from '$components/Hero.svelte'
	import NavBar from '$components/NavBar.svelte'
	import AvatarIntro from '$components/AvatarIntro.svelte'

	let container: Element
</script>

{#if $session.introHasPlayed}
	{#if $page.path == '/'}
		<Hero target={container} />
	{/if}

	<NavBar />

	<BackToTop target={container} />

	<main bind:this={container} in:fly={{ x: -200, delay: 500 }}>
		<slot />
	</main>
{:else}
	<AvatarIntro />
{/if}

<style lang="scss">
	main {
		margin: 0 auto;

		width: var(--content-width);
		padding: 1em 2em;
	}
</style>
