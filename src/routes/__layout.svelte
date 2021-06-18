<script>
	import { setContext } from 'svelte'
	import { writable } from 'svelte/store'
	import { fly } from 'svelte/transition'

	import AvatarIntro from '$components/AvatarIntro.svelte'

	const introHasPlayed = writable(false)
	setContext('intro-played', introHasPlayed)
</script>

{#if $introHasPlayed}
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
