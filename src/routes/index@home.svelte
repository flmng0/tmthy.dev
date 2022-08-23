<script lang="ts">
	import Hero from '$lib/home/Hero.svelte'
	import SiteNav from '$lib/SiteNav.svelte'

	let windowHeight: number
</script>

<svelte:window bind:innerHeight={windowHeight} />

<Hero />
<SiteNav openMargin={windowHeight || 1000} />

<h1>Welcome to tmthy.dev</h1>
