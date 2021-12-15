<script lang="ts">
	import Hero from '$components/index/Hero.svelte'
	import { siteName } from '$lib/consts'
</script>

<svelte:head>
	<title>{siteName}</title>
</svelte:head>

<Hero />
