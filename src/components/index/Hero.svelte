<script lang="ts">
	import { avatar } from '$lib/consts'
	import type { Settings } from '$lib/disperse'
	import { DisperseSimulation } from '$lib/disperse'
	import { theme } from '$lib/stores'

	import AvatarIcon from '$components/AvatarIcon.svelte'
	import TextRotator from '$components/index/TextRotator.svelte'

	import { onMount, tick } from 'svelte'
	import type { TransitionConfig } from 'svelte/transition'
	import { fade } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'

	let text: HTMLParagraphElement = null
	let headerHeight: number = 0

	const skills: Array<string> = [
		'Web Developer',
		'Software Engineer',
		'Graphical Designer',
		// 'Game Developer' ... Put this back when I actually release one.
	]

	const settings: Settings = {
		minRepelDist: 100,

		repelStrength: 20,
		returnStrength: 10,
		frictionStrength: 1.5,

		minConnectWidth: 2,
		polygonSize: 512,
	}

	let width: number, height: number
	const connectOpacity = 0.125

	let introComplete: boolean = false

	const onIntroComplete = async () => {
		introComplete = true

		await tick()

		const canvas: HTMLCanvasElement = document.querySelector('canvas#hero--canvas')

		const simulation = new DisperseSimulation(canvas, avatar, settings)

		theme.subscribe((theme) => {
			switch (theme) {
				case 'dark': {
					simulation.pointStyle = '#0000'
					simulation.connectStyle = `rgba(255, 255, 255, ${connectOpacity})`
					break
				}
				case 'light': {
					simulation.pointStyle = '#0000'
					simulation.connectStyle = `rgba(0, 0, 0, ${connectOpacity})`
					break
				}
			}
		})

		const nav = document.querySelector('.page-nav')
		headerHeight = nav.getBoundingClientRect().height

		let latestAnimationRequest: number
		const draw: FrameRequestCallback = (t) => {
			simulation.draw(t)
			latestAnimationRequest = window.requestAnimationFrame(draw)
		}

		window.requestAnimationFrame(draw)

		return () => {
			if (latestAnimationRequest) {
				window.cancelAnimationFrame(latestAnimationRequest)
			}
		}
	}

	let avatarIntroSize: number
	let avatarIntroRatio: number

	onMount(() => {
		const nav = document.querySelector('.page-nav')
		const navHeight = nav.getBoundingClientRect().height

		width = document.body.clientWidth
		height = window.innerHeight - navHeight

		window.addEventListener('resize', (e) => {
			width = document.body.clientWidth
			height = window.innerHeight - navHeight
		})

		avatarIntroSize = Math.min(settings.polygonSize * 1.5, width * 0.95, height * 0.95)
		avatarIntroRatio = avatarIntroSize / settings.polygonSize
	})

	const avatarOutro = (node: Element, params: any): TransitionConfig => {
		const transformScale = 1.0 - 1.0 / avatarIntroRatio

		const opacityScale = 1.0 - connectOpacity

		return {
			delay: params.delay || 0,
			duration: params.duration || 1000,
			easing: params.easing || quintOut,

			css: (t, u) => `
                stroke-width: ${1.0 - u * 0.7};
                transform: scale(${1.0 - u * transformScale});
                opacity: ${1.0 - u * opacityScale};
            `,
		}
	}
</script>

<div class="hero-container" style="--width: {width}px; --height: {height}px">
	{#if !introComplete}
		<div class="hero--intro" out:avatarOutro>
			<AvatarIcon
				on:introend={onIntroComplete}
				stroke
				strokeWidth="inherit"
				animate
				size="{avatarIntroSize}px"
			/>
		</div>
	{:else}
		<div class="hero--main" in:fade>
			<canvas id="hero--canvas" {width} {height} />
			<p in:fade={{ delay: 500 }}>
				Hi! I'm Tim: <span class="skill"><TextRotator items={skills} /></span>
			</p>
		</div>
	{/if}
</div>

<style lang="scss">
	:global(body[--data-theme='dark']) .hero--intro {
		color: white;
	}

	:global(body[--data-theme='light']) .hero--intro {
		color: black;
	}

	.hero--intro {
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;

		stroke-width: 1;
	}

	.hero-container {
		width: var(--width, 100vw);
		height: var(--height, 100vh);

		position: relative;
		margin: 0;
		padding: 0;
	}

	.hero--main {
		& > canvas {
			display: block;
			user-select: none;

			width: 100%;
		}

		& > p {
			position: absolute;
			top: 40%;
			left: 50%;
			transform: translate(-50%, -50%);

			font-size: 2rem;

			user-select: none;
		}

		.skill {
			color: var(--color-main);
		}
	}
</style>
