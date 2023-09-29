<script>
	export let data;
</script>

<svelte:head>
	<script src={data.scriptSrc} type="module"></script>
</svelte:head>

<svelte:component this={data.content} />
