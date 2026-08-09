<script>
	import PositionCard from './PositionCard.svelte'
	import { state } from './state.svelte'
	import ReferenceCard from './ReferenceCard.svelte'

	let { positions, skills } = $props()
</script>

{#snippet header(/** @type {string} */ name)}
	<h2 class="mt-2 mb-4 text-center text-2xl font-semibold tracking-wide uppercase">{name}</h2>
{/snippet}

{#snippet contact(
	/** @type {string} */ name,
	/** @type {string} */ href,
	/** @type {string} */ display
)}
	<span class="align-baseline font-mono text-sm">
		{name}:
		<a class="align-baseline not-hover:underline" {href}>{display}</a>
	</span>
{/snippet}

<div class="container mx-auto flex max-w-prose flex-col justify-center px-2 py-8">
	<header class="mt-2 flex flex-col items-center space-y-4">
		<div class="w-fit">
			<h1 class="font-mono text-3xl tracking-wide">Timothy Mitchell Davis</h1>
			<p class="text-lg">Software Developer</p>
		</div>
		<address class="flex flex-col items-center gap-x-2 gap-y-1 not-italic">
			{@render contact('Business Email', 'mailto:me@timd.dev', 'me@timd.dev')}
			{@render contact('Personal Email', 'mailto:tmthydvs@gmail.com', 'tmthydvs@gmail.com')}
			{#if state.secrets !== null}
				{@render contact('Mobile', state.secrets.mobile.href, state.secrets.mobile.display)}
			{:else}
				{@render contact('Mobile', '#', 'checking...')}
			{/if}
		</address>

		<div class="space-y-4 leading-7 tracking-wide text-neutral-700 italic">
			<p>
				Software developer who believes in programming as a creative outlet, holds pride in his
				work, and has a thirst for learning.
			</p>

			<p>
				Timothy enjoys working with functional programming and rendering development in his spare
				time, as well as experimenting with programming using local LLMs.
			</p>
		</div>
	</header>

	<div class="separator my-10"></div>

	<section id="positions">
		{@render header('Previous Positions')}
		<ol class="space-y-12">
			{#each positions as position, i}
				<li class="break-inside-avoid">
					<PositionCard {...position} />
				</li>

				{#if i < positions.length - 1}
					<div class="separator mb-12"></div>
				{/if}
			{/each}
		</ol>
	</section>

	<!-- <div class="separator my-10"></div> -->
	<!-- <section id="projects"> -->
	<!-- 	{@render header('Projects')} -->
	<!-- 	<ul class="flex flex-col space-y-12"></ul> -->
	<!-- </section> -->

	{#if state.secrets}
		<div class="separator my-10"></div>
		<section id="references">
			{@render header('References')}
			<ul class="flex flex-wrap gap-x-12 gap-y-8 text-center">
				{#each state.secrets.references as reference}
					<li class="flex-1">
						<ReferenceCard {reference} />
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</div>

<style>
	@media only print {
		:root {
			font-size: 14px;
		}

		:global(.max-w-prose, .prose) {
			width: 100%;
			max-width: 80ch;
		}

		:global(.separator) {
			border: none;
		}
	}
</style>
