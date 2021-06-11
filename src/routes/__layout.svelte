<script>
	import { onMount } from 'svelte'

	import BackToTop from '$lib/BackToTop.svelte'
	import Navigation from '$lib/Navigation.svelte'

	let headerHeight

	onMount(() => {
		const header = document.querySelector('#page-header')
		const headerHeightStr = getComputedStyle(header).height

		headerHeight = Number(headerHeightStr.slice(0, -2))
		console.log(headerHeight)
	})
</script>

<header id="page-header">
	<Navigation />
</header>

<main>
	<slot />
</main>

<footer>
	<!-- keep -->
</footer>

<BackToTop minFromTop={headerHeight || 50} />

<style>
	header,
	main {
		padding: 0 1.5rem;
	}
</style>
