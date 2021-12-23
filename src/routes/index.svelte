<script lang="ts">
	import Hero from "$components/index/Hero.svelte";
	import Main from "$components/Main.svelte";
	import { siteName } from "$lib/consts";

	let heroComplete = false;
</script>

<svelte:head>
	<title>{siteName}</title>
</svelte:head>

<Hero on:complete={() => (heroComplete = true)} />

<Main intro={false} />
