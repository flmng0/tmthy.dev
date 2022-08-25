<script lang="ts">
	import type { PageData } from './$types'

	import SketchCardList from '$lib/sketches/CardList.svelte'
	import { name } from '$lib/site'

	export let data: PageData

	const { sketches } = data
</script>

<svelte:head>
	<title>Sketches | {name}</title>
</svelte:head>

<header>
	<h1>Sketches</h1>
	<p>Creative coding projects, or small projects that don't need their own GitHub page.</p>
	<p><em>Hover over a sketch to preview</em></p>
</header>

<main>
	<SketchCardList {sketches} />
</main>

<style lang="scss">
	em {
		font-weight: 500;
		color: var(--col-main);
	}
</style>
