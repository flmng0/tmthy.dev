<script>
	import { getContext, onMount } from 'svelte'
	import { backIn } from 'svelte/easing'
	import { fade } from 'svelte/transition'
	import { session } from '$app/stores'

	import AvatarIcon from '$components/AvatarIcon.svelte'

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
		session.set({ ...$session, introHasPlayed: true })
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
			<AvatarIcon stroke animate size="100%" on:introend={() => (complete = true)} />
		</div>
	</div>
{/if}

<style lang="scss">
	.overlay {
		position: fixed;
		top: 0;
		left: 0;

		width: 100vw;
		height: 100vh;

		display: grid;
		place-items: center;

		background-color: var(--color-bg-primary);
	}

	.avatar {
		height: min(100%, 700px);
	}
</style>
