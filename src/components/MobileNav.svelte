<script lang="ts">
	import { MenuIcon } from 'svelte-feather-icons'
	import type { Page } from './NavBar.svelte'

	export let pages: Page[]
</script>

<div class="mobile-nav">
	<button>
		<MenuIcon size="1.75x" />
	</button>
	<nav>
		{#each pages as page}
			<a href={page.href}>{page.name}</a>
		{/each}
	</nav>
</div>

<style lang="scss">
	.mobile-nav {
		position: relative;
		font-size: 1.15rem;

		nav {
			position: absolute;
			top: 100%;
			right: 0;
			display: none;

			flex-flow: column nowrap;

			box-shadow: 0 4px 4px var(--color-shadow);

			a {
				min-width: 20ch;
				max-width: 100%;
				padding: 0.7em 0.9em;
				background-color: var(--color-bg-primary);

				&:hover {
					text-decoration: none;
					filter: brightness(1.2);
				}
			}
		}

		button {
			border: 0;
			background: var(--color-bg-primary);
			color: var(--color-fg-primary);

			padding: 0.8em 1em;

			&:hover {
				filter: brightness(1.2);
			}
		}

		&:not(:focus-within) button {
			cursor: pointer;
		}

		&:focus-within nav {
			display: flex;
		}
	}
</style>
