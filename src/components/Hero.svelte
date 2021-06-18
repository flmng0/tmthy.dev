<script>
	import { skills } from '$lib/consts'
	import TextRotator from '$components/TextRotator.svelte'

	const skillInterval = 2000
</script>

<header class="hero">
	<section class="heading">
		<h1>Hello, my name is Tim. I am a</h1>

		<div class="skill">
			<TextRotator items={skills} interval={skillInterval} />
		</div>
	</section>
</header>

<style lang="scss">
	.hero {
		display: grid;
		place-items: center;

		height: 100vh;
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
