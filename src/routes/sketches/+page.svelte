<script lang="ts">
	import type { SketchDetails } from '$lib/data/sketch'

	import SketchCardList from '$lib/sketches/CardList.svelte'
	import type { PageData } from './$types'

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
