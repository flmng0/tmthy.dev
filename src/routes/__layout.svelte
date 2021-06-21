<script>
	import { setContext } from 'svelte'
	import { session } from '$app/stores'
	import { fly } from 'svelte/transition'

	import AvatarIntro from '$components/AvatarIntro.svelte'
</script>

{#if $session.introHasPlayed}
	<div class="container" in:fly={{ x: -200, delay: 500 }}>
		<slot />
	</div>
{:else}
	<AvatarIntro />
{/if}

<style lang="scss">
	.container {
		width: 100%;
	}
</style>
