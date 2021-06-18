<script>
	import { getContext, onMount } from 'svelte'
	import { backIn } from 'svelte/easing'
	import { fade } from 'svelte/transition'

	import AvatarIcon from '$components/AvatarIcon.svelte'

	const introHasPlayed = getContext('intro-played')

	let complete = false
	const avatarTransition = {
		blur: 20,
		duration: 1250,
		easing: backIn,
	}

	function outro(node, { blur, ...options }) {
		return {
			css: (t) => `
                transform: scale(${0.5 + t * 0.5});
                filter: blur(${blur - blur * t}px);
                opacity: ${t};
            `,
			...options,
		}
	}

	function finished() {
		introHasPlayed.set(true)
	}

	let avatarContainer

	function skipAnimation() {
		avatarContainer.style.animationDuration = '1ms'
	}

	onMount(() => {
		document.body.style.overflow = 'hidden'

		return () => {
			document.body.style.overflow = 'initial'
		}
	})
</script>

{#if !complete}
	<div class="overlay">
		<div
			class="avatar"
			bind:this={avatarContainer}
			out:outro={avatarTransition}
			on:outroend={finished}
			on:click={skipAnimation}
		>
			<AvatarIcon animate size="100%" bind:complete />
		</div>
	</div>
{/if}

<style lang="scss">
	.overlay {
		position: fixed;
		top: 0;
		left: 0;

		right: 0;
		bottom: 0;

		background-color: var(--color-bg-primary);
	}

	.avatar {
		height: 100%;
	}
</style>
