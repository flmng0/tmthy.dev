<script>
	import { onMount } from 'svelte'
	import { draw } from 'svelte/transition'

	import { avatarTriangles as originalTriangles } from './consts'

	export let size = '100%'
	export let strokeWidth = 1.5

	export let duration = 250
	export let initialDelay = 250
	export let delayInterval = 100

	const avatarTriangles = Array.from(originalTriangles)
	for (let i = avatarTriangles.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1))

		const temp = avatarTriangles[i]
		avatarTriangles[i] = avatarTriangles[j]
		avatarTriangles[j] = temp
	}

	let unique

	function restart() {
		unique = {}
	}

	onMount(restart)
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 100 100"
	stroke="currentColor"
	stroke-width={`${strokeWidth}`}
	stroke-linecap="round"
	stroke-linejoin="round"
	fill="none"
	on:click={restart}
>
	<!-- Important that the if is inside the SVG, then the SVG's size will
        always be included in the DOM... -->
	{#key unique}
		{#each avatarTriangles as tri, i}
			<path
				in:draw={{
					duration,
					delay: initialDelay + i * delayInterval,
				}}
				d={`M ${tri.map((point) => Object.values(point).join(',')).join(' ')} Z`}
			/>
		{/each}
	{/key}
</svg>
