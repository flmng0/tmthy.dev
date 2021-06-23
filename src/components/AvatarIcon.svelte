<script>
	import { createEventDispatcher, onMount } from 'svelte'
	import { draw } from 'svelte/transition'

	import { avatarColorMap, avatarColors, avatarTriangles } from '$lib/consts'
	import { shuffle } from '$lib/util'

	export let animate = false

	export let size = '100%'
	export let strokeWidth = 1.5

	export let stroke = false
	export let fill = false

	const dispatch = createEventDispatcher()

	const duration = animate ? 750 : 0
	const delayInterval = animate ? 50 : 0
	const initialDelay = animate ? 250 : 0

	// Left undefined on purpose. See notes at {#if order} below.
	let order

	const fillColor = (i) => avatarColors[avatarColorMap[i]]

	const pathString = (tri) =>
		`M ${tri.map((point) => Object.values(point).join(',')).join(' ')} Z`

	let drawnTriangles = 0

	let introstart = () => {
		dispatch('introstart')
		// One off
		introstart = () => {}
	}

	let introend = () => {
		drawnTriangles += 1
		if (drawnTriangles == avatarTriangles.length) {
			dispatch('introend')
		}
	}

	onMount(() => {
		order = Array.from({ length: avatarTriangles.length }, (_, i) => i)
		// See notes at {#if order} below, for why this is defined here.
		if (animate) {
			order = shuffle(order)
		}
	})
</script>

<!-- Makes it so the avatar doesn't flicker when it's mounted. -->
{#if order}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 100 100"
		stroke={stroke ? 'currentColor' : null}
		stroke-width={`${strokeWidth}`}
		stroke-linecap="round"
		stroke-linejoin="round"
		fill="none"
	>
		{#each avatarTriangles as tri, i}
			<path
				in:draw={{
					duration,
					delay: initialDelay + order[i] * delayInterval,
				}}
				on:introstart={introstart}
				on:introend={introend}
				fill={fill ? fillColor(i) : null}
				d={pathString(tri)}
			/>
		{/each}
	</svg>
{/if}
