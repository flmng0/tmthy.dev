<script lang="ts">
	export let href: string
	export let name: string
	export let description: string

	export let imageSrc: string = null

	function loaded(node: HTMLElement) {
		const setHeight = (node: HTMLElement) => {
			const desc = node.querySelector('.text > p')
			const height = getComputedStyle(desc).height
			node.style.setProperty('--desc-height', height)
		}

		window.addEventListener('resize', () => {
			setHeight(node)
		})

		setHeight(node)
	}
</script>

<div use:loaded class="card">
	{#if imageSrc}
		<img src={imageSrc} alt="Image of {name}" />
	{/if}
	<a {href} class="text">
		<h1>{name}</h1>
		<p>{description}</p>
	</a>
</div>

<style lang="scss">
	.card {
		display: block;
		position: relative;

		width: 100%;
		height: 100%;

		border-radius: 0.75em;
		overflow: hidden;
	}

	.card:hover,
	.card:active {
		h1 {
			text-decoration: underline;
		}

		> img + .text {
			bottom: 0;
		}
	}

	img {
		width: 100%;
		margin: 0;
	}

	.text {
		display: block;
		text-decoration: none;

		--vert-padding: 2em;
		padding: 1em var(--vert-padding);
		background-color: var(--color-bg-secondary);
		width: 100%;
		height: 100%;
	}

	img + .text {
		height: auto;
	}

	img + .text {
		position: absolute;
		bottom: calc(-1 * var(--desc-height, 0) - var(--vert-padding));

		transition: bottom 150ms ease-out;
	}
</style>
