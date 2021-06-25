<script lang="ts">
	import { SvelteComponent } from 'svelte'
	import { slide } from 'svelte/transition'
	import { XIcon, HomeIcon, MenuIcon, PenToolIcon } from 'svelte-feather-icons'

	import AvatarIcon from '$components/AvatarIcon.svelte'
	import Dropdown from '$components/Dropdown.svelte'
	import ThemePicker from '$components/ThemePicker.svelte'

	import { featherIconSize } from '$lib/consts'

	interface NavItem {
		route: string
		label: string
		icon: typeof SvelteComponent
	}

	const pages: Array<NavItem> = [
		{ route: '/', label: 'Home', icon: HomeIcon },
		{ route: '/sketches', label: 'Sketches', icon: PenToolIcon },
	]

	let menuButton: Element
	let menuShown: boolean
</script>

<header>
	<!-- Left -->
	<section class="header-left">
		<Dropdown button={menuButton} bind:open={menuShown}>
			<button bind:this={menuButton} class:active={menuShown} title="Open navigation menu">
				{#if menuShown}
					<XIcon size={featherIconSize} />
				{:else}
					<MenuIcon size={featherIconSize} />
				{/if}
			</button>
			<nav transition:slide slot="dropdown-items">
				{#each pages as page}
					<a href={page.route} title={`Visit the ${page.label} page`}>
						<span class="nav-label">{page.label}</span>
						<span class="nav-icon">
							<svelte:component this={page.icon} size={featherIconSize} />
						</span>
					</a>
				{/each}
			</nav>
		</Dropdown>
	</section>

	<!-- Middle -->
	<section class="header-middle">
		<a class="avatar" href="/">
			<AvatarIcon stroke size="100%" />
		</a>
	</section>

	<!-- Right -->
	<section class="header-right">
		<ThemePicker />
	</section>
</header>

<style lang="scss">
	header {
		// Just incase;
		z-index: 10;
		position: sticky;
		top: 0;

		display: grid;
		grid-template-columns: repeat(3, 1fr);

		font-size: 1.5rem;

		padding: 0 0.5em;
		margin-bottom: 1rem;

		width: 100%;
		height: var(--header-height);

		background-color: var(--color-bg-secondary);
		box-shadow: 0 2px 8px 0 var(--color-shadow);
	}

	.header-left {
		justify-self: flex-start;
	}
	.header-middle {
		justify-self: center;
	}
	.header-right {
		justify-self: flex-end;
	}

	section {
		height: var(--header-height);
		display: flex;
		align-items: center;
	}

	.avatar {
		display: block;
		height: 100%;
	}

	nav {
		width: 20ch;
		box-shadow: 0 2px 8px 0 var(--color-shadow);
	}

	button {
		position: relative;

		padding: 1em 1.2em;

		border: none;

		&::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}

		&.active {
			background-color: var(--color-fg-secondary);
			color: var(--color-bg-secondary);
		}
	}

	button,
	nav > a {
		background-color: var(--color-bg-primary);
		color: var(--color-fg-primary);

		cursor: pointer;
		&:hover {
			background-color: var(--color-fg-primary);
			color: var(--color-bg-primary);
		}
	}

	nav > a {
		display: flex;
		justify-content: space-between;

		padding: 1em 2em;
		font-size: 1rem;

		border: 2px solid var(--color-bg-primary);
		text-decoration: none;
	}
</style>
