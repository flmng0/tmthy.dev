<script>
	let { reference } = $props()
</script>

<div class="flex flex-col items-center text-start">
	<header>
		<p class="font-mono text-lg">{reference.name}</p>
		<p class="text-sm leading-none text-neutral-700">{reference.title}</p>
	</header>

	<address class="mt-4 not-italic">
		{#if reference.mobile}
			<p>{reference.mobile}</p>
		{/if}
		{#if reference.email}
			<p>{reference.email}</p>
		{/if}
	</address>
</div>
