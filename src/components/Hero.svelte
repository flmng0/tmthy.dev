<script lang="ts">
	import { fade } from 'svelte/transition'
	import { ArrowDownIcon } from 'svelte-feather-icons'

	import TextRotator from '$components/TextRotator.svelte'

	const skills = ['Web Developer', 'Network Engineer', 'Game Developer', 'Digital Artist']
	const skillInterval = 2000

	export let target: Element

	let y: number
	let height: number
	let continueShown = false

	function clicked() {
		target.scrollIntoView()
	}
</script>

<svelte:window bind:scrollY={y} bind:innerHeight={height} />

<div class="hero" on:click={clicked}>
	<section class="heading">
		<h1>Hello, my name is Tim. I am a</h1>

		<div class="skill">
			<TextRotator items={skills} interval={skillInterval} />
		</div>
	</section>
	{#if !continueShown && y < 0.2 * height}
		<section
			class="instruction"
			out:fade
			on:outroend={() => {
				continueShown = true
			}}
		>
			<span>
				Click/tap anywhere, or scroll to continue.
				<div class="down-arrow">
					<ArrowDownIcon size="1.5x" strokeWidth="1" />
				</div>
			</span>
		</section>
	{/if}
</div>

<style lang="scss">
	.hero {
		position: relative;
		display: grid;
		place-items: center;

		cursor: pointer;

		height: 100vh;
	}

	@keyframes bounce {
		0% {
			transform: translateY(0%);
		}
		50% {
			transform: translateY(25%);
		}
		100% {
			transform: translateY(0%);
		}
	}

	.instruction {
		position: absolute;

		display: flex;
		flex-flow: column nowrap;
		align-items: center;

		bottom: 0;

		& > span {
			position: relative;
			padding-bottom: 0.5em;
			margin-bottom: 2em;

			color: var(--color-fg-secondary);

			.down-arrow {
				position: absolute;
				top: 100%;
				left: 50%;
				transform: translateX(-50%);
				animation: bounce 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
			}
		}
	}

	.heading {
		width: min(80%, 25ch);

		font-size: 2rem;
		line-height: 2.5em;
		letter-spacing: 0.05em;

		& > * {
			display: inline;

			font-size: inherit;
		}
	}

	h1 {
		font-weight: bold;
	}

	.skill {
		color: var(--color-main);

		font-weight: normal;
	}
</style>
