<script>
	import { telHref } from './util'

	let { reference } = $props()
</script>

<div class="flex flex-col items-center text-start">
	<header>
		<p class="font-mono text-lg">{reference.name}</p>
		<p class="text-sm leading-none text-neutral-700">{reference.title}</p>
	</header>

	<address class="mt-4 not-italic">
		{#if reference.mobile}
			<p><a href={telHref(reference.mobile)} class="text-neutral-700">{reference.mobile}</a></p>
		{/if}
		{#if reference.email}
			<p><a href="mailto:{reference.email}" class="text-neutral-700">{reference.email}</a></p>
		{/if}
	</address>
</div>
