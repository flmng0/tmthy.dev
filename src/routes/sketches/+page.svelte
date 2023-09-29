<script>
	export let data;
</script>

{#each data.slugs as slug}
	<a href="/sketches/{slug}">{slug}</a>
{/each}
