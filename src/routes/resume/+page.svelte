<script>
	import { loadSecrets, state } from './state.svelte'
	import Turnstile from '$lib/Turnstile.svelte'
	import Resume from './Resume.svelte'
	import { fade } from 'svelte/transition'
	import { cubicOut } from 'svelte/easing'

	let { data } = $props()
</script>

<svelte:head>
	<title>Resume of Timothy Davis</title>
	<meta
		name="description"
		content="The resume of software developer Timothy Davis, including working history and notable achievements."
	/>
</svelte:head>

{#if state.secrets === null}
	<div
		class="fixed inset-0 z-10 bg-white"
		out:fade={{ duration: 1000, delay: 200, easing: cubicOut }}
	>
		<div
			class="container mx-auto flex h-full max-w-xl flex-col items-center justify-center gap-y-4 px-4"
		>
			<div class="space-y-4">
				<h2 class="font-mono text-lg">Checking you're not a robot.</h2>
				<p>
					This page has sensitive contact information, like my mobile number and the contact
					information for references.
				</p>
				<p>
					You're seeing this message so that the afforementioned information can't be scraped by
					bots.
				</p>
			</div>
			<Turnstile callback={(token) => loadSecrets(token)} />
		</div>
	</div>
{/if}

{#if state.secrets}
	<Resume {...data} />
{/if}
