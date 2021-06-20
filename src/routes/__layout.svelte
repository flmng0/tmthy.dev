<script>
	import { setContext } from 'svelte'
	import { session } from '$app/stores'
	import { fly } from 'svelte/transition'

	import AvatarIntro from '$components/AvatarIntro.svelte'
</script>

{#if $session.introHasPlayed}
	<main in:fly={{ x: -200, delay: 500 }}>
		<slot />
	</main>
{:else}
	<AvatarIntro />
{/if}

<style lang="scss">
	main {
		width: 100%;
	}
</style>
