<script lang="ts">
	import { onMount } from "svelte";

	import BackToTop from "$components/BackToTop.svelte";
	import NavBar from "$components/NavBar.svelte";

	import { theme } from "$lib/stores";
	import "./global.scss";

	onMount(() => {
		document.body.setAttribute("data-theme", $theme);
	});
</script>

<NavBar />

<BackToTop />

<slot />
