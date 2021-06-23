<script>
	import { setContext } from 'svelte'
	import { session, page } from '$app/stores'
	import { fly } from 'svelte/transition'

	import BackToTop from '$components/BackToTop.svelte'
	import Hero from '$components/Hero.svelte'
	import NavBar from '$components/NavBar.svelte'
	import AvatarIntro from '$components/AvatarIntro.svelte'

	let mainElement
</script>

{#if $session.introHasPlayed}
	{#if $page.path == '/'}
		<Hero {mainElement} />
	{/if}

	<NavBar />

	<BackToTop target={mainElement} />

	<main bind:this={mainElement} in:fly={{ x: -200, delay: 500 }}>
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
