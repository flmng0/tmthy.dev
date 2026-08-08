<script>
	import { state } from './state.svelte'

	let { data, body: Body } = $props()

	const format = new Intl.DateTimeFormat('en-AU', {
		dateStyle: 'medium'
	})
</script>

<article>
	<header class="mb-8">
		<p class="mb-1 font-mono text-neutral-700">
			{#if data.end}
				<time>{format.formatRange(data.start, data.end)}</time>
			{:else}
				<time>{format.format(data.start)}</time>
			{/if}
		</p>
		<h2 class="mt-0 mb-2 font-mono text-xl font-semibold tracking-wide">{data.title}</h2>
		{#if data.skills}
			<ul class="flex flex-row flex-wrap items-start gap-x-2 gap-y-2 text-sm">
				{#each data.skills as skill}
					<li
						class="bg-neutral-50 px-1 text-neutral-700 outline outline-neutral-300"
						class:active={state.highlighted === skill}
					>
						{skill}
					</li>
				{/each}
			</ul>
		{/if}
	</header>

	<main
		class="prose prose-headings:font-mono prose-headings:font-medium prose-headings:text-neutral-800"
	>
		<Body />
	</main>
</article>
