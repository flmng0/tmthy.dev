<script lang="ts">
	import { onMount, SvelteComponent } from 'svelte'
	import { GithubIcon, GlobeIcon } from 'svelte-feather-icons'

	export let href: string = null
	export let links: Record<string, string> = null
	export let name: string
	export let description: string

	export let imageSrc: string = null

	const linkIcons: Record<string, typeof SvelteComponent> = {
		github: GithubIcon,
		web: GlobeIcon,
	}

	const setHeight = (node: HTMLElement) => {
		const desc = node.querySelector('.text > p')

		if (desc) {
			const height = getComputedStyle(desc).height
			node.style.setProperty('--desc-height', height)
		}
	}

	function loaded(node: HTMLElement) {
		window.addEventListener('resize', () => {
			setHeight(node)
		})

		setHeight(node)
	}

	let container: HTMLDivElement

	onMount(async () => {
		// If there is only one link, set it as the main header text link
		// as-well.
		if (href == null) {
			const values = Object.values(links)
			if (values.length == 1) {
				href = values[0]
			}
		}

		setHeight(container)
	})
</script>

<div use:loaded bind:this={container} class="card">
	{#if imageSrc}
		<img src={imageSrc} alt="Image of {name}" />
	{/if}
	<div class="text">
		<header>
			{#if href}
				<a {href}>
					<h1>{name}</h1>
				</a>
			{:else}
				<h1>{name}</h1>
			{/if}
			{#if links}
				{#each Object.entries(links).filter(([type]) => !!linkIcons[type]) as [type, href]}
					<a {href} target="_blank">
						<svelte:component this={linkIcons[type]} size="1.5x" />
					</a>
				{/each}
			{/if}
		</header>
		<p>{description}</p>
	</div>
</div>

<style lang="scss">
	.card {
		display: block;
		position: relative;

		width: 100%;
		height: 100%;

		border-radius: 0.75em;
		overflow: hidden;

		&:hover,
		&:active {
			> img + .text {
				bottom: 0;
			}
		}
	}

	a:hover {
		text-decoration: none;
	}

	img {
		width: 100%;
		margin: 0;
		background: #f8f8f2;
	}

	.text {
		display: block;

		--vert-padding: 2em;
		padding: 1em var(--vert-padding);
		background-color: var(--color-bg-secondary);
		width: 100%;
		height: 100%;

		header {
			display: flex;
			flex-flow: row nowrap;
			width: 100%;
			gap: 0.75em;

			h1 {
				margin: 0.5em 0;
			}

			> :first-child {
				flex-grow: 1;
			}

			> :not(:first-child) {
				line-height: 1em;
				margin: 1em 0;
				padding: 0.7em 0.8em;
				height: min-content;
				border-radius: 0.5em;
				background-color: var(--color-bg-primary);

				&:hover,
				&:active {
					filter: brightness(1.2);
				}
			}
		}
	}

	img + .text {
		height: auto;
		position: absolute;
		bottom: calc(-1 * var(--desc-height, 0) - var(--vert-padding));

		transition: bottom 150ms ease-out;
	}
</style>
