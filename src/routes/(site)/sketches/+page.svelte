<script lang="ts">
	import type { PageData } from './$types'

	import SketchCardList from '$lib/sketches/CardList.svelte'

	export let data: PageData

	const { sketches } = data
</script>

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
