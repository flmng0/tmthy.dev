<script>
	import { env } from '$env/dynamic/public'
	import { onMount } from 'svelte'

	/** @type {{ callback: (token: string) => void }} */
	let { callback } = $props()

	let widgetElem = $state()

	onMount(() => {
		//@ts-ignore
		const widgetId = window.turnstile.render(widgetElem, {
			sitekey: env.PUBLIC_TURNSTILE_SITE_KEY,
			theme: 'light',
			size: 'normal',
			callback
		})

		return () => {
			//@ts-ignore
			window.turnstile.remove(widgetId)
		}
	})
</script>

<svelte:head>
	<script
		src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
		defer
	></script>
	<link rel="preconnect" href="https://challenges.cloudflare.com" />
</svelte:head>

<div bind:this={widgetElem} style:width="300px" style:height="65px"></div>
