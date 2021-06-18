<script>
	import { onMount } from 'svelte'
	import { draw } from 'svelte/transition'

	import { avatarTriangles as originalTriangles } from '$lib/consts'
	import { shuffle } from '$lib/util'

	export let animate

	export let size = '100%'
	export let strokeWidth = 1.5

	let duration, delayInterval, initialDelay

	if (animate) {
		duration = 750
		delayInterval = 50
		initialDelay = 250
	} else {
		duration = delayInterval = initialDelay = 0
	}

	// Left undefined on purpose. See notes at {#if avatarTriangles} below.
	let avatarTriangles

	const pathString = (tri) =>
		`M ${tri.map((point) => Object.values(point).join(',')).join(' ')} Z`

	let drawnTriangles = 0

	export let complete
	$: complete = !animate || (avatarTriangles && drawnTriangles == avatarTriangles.length)

	onMount(() => {
		// See notes at {#if avatarTriangles} below.
		avatarTriangles = Array.from(originalTriangles)
		if (animate) {
			avatarTriangles = shuffle(avatarTriangles)
		}
	})
</script>

<!-- Makes it so the avatar doesn't flicker when it's mounted. -->
{#if avatarTriangles}
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
	>
		{#each avatarTriangles as tri, i}
			<path
				in:draw={{
					duration,
					delay: initialDelay + i * delayInterval,
				}}
				on:introend={() => {
					drawnTriangles += 1
				}}
				d={pathString(tri)}
			/>
		{/each}
	</svg>
{/if}
