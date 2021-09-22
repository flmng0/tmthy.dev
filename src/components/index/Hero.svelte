<script lang="ts">
	import { avatar } from '$lib/consts'
	import type { Settings } from '$lib/disperse'
	import { DisperseSimulation } from '$lib/disperse'
	import { theme } from '$lib/stores'

	import { onMount } from 'svelte'

	let canvas: HTMLCanvasElement = null
	let headerHeight: number = 0

	onMount(() => {
		const settings: Settings = {
			minRepelDist: 100,

			repelStrength: 20,
			returnStrength: 10,
			frictionStrength: 1.5,

			minConnectWidth: 2,
			polygonSize: 512,
		}

		const simulation = new DisperseSimulation(canvas, avatar, settings)

		theme.subscribe((theme) => {
			switch (theme) {
				case 'dark': {
					simulation.pointStyle = 'grey'
					simulation.connectStyle = '#fff8'

					break
				}

				case 'light': {
					simulation.pointStyle = 'darkgrey'
					simulation.connectStyle = '#0008'

					break
				}
			}
		})

		const nav = document.querySelector('.page-nav')
		headerHeight = nav.getBoundingClientRect().height

		const tick: FrameRequestCallback = (t) => {
			simulation.draw(t)

			window.requestAnimationFrame(tick)
		}

		window.requestAnimationFrame(tick)
	})

	let windowWidth: number, windowHeight: number
	$: width = windowWidth
	$: height = windowHeight - headerHeight
</script>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} />
<canvas bind:this={canvas} {width} {height} />

<style lang="scss">
	canvas {
		display: block;
		user-select: none;
		margin: 0;
		padding: 0;

		width: 100%;
	}
</style>
