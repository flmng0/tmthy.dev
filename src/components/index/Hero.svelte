<script lang="ts">
	import { avatar } from '$lib/consts'
	import type { Settings } from '$lib/disperse'
	import { DisperseSimulation } from '$lib/disperse'
	import { theme } from '$lib/stores'

	import AvatarIcon from './AvatarIcon.svelte'
	import TextRotator from './TextRotator.svelte'

	import { onMount, tick } from 'svelte'
	import { fly, TransitionConfig } from 'svelte/transition'
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

		repelStrength: 24.0,
		returnStrength: 16.0,
		frictionStrength: 1.2,

		minConnectWidth: 2.0,
		polygonSize: 512,
	}

	let width: number, height: number
	const connectOpacity = 0.3

	let introComplete: boolean = false
	let outroComplete: boolean = false
	let simulation: DisperseSimulation = null

	let latestAnimationRequest: number = null

	const onOutroComplete = async () => {
		outroComplete = true

		await tick()

		const canvas: HTMLCanvasElement = document.querySelector('canvas#hero--canvas')

		simulation = new DisperseSimulation(canvas, avatar, settings)

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

		simulation.draw(null)

		const draw: FrameRequestCallback = (t) => {
			simulation.draw(t)
			latestAnimationRequest = window.requestAnimationFrame(draw)
		}

		latestAnimationRequest = window.requestAnimationFrame(draw)
	}

	let avatarIntroSize: number
	let avatarIntroRatio: number

	onMount(() => {
		const nav = document.querySelector('.page-nav')
		const navHeight = nav.getBoundingClientRect().height

		width = document.body.clientWidth
		height = window.innerHeight - navHeight

		settings.polygonSize = Math.min(512, width * 0.8, height * 0.8)

		window.addEventListener('resize', (e) => {
			width = document.body.clientWidth
			height = window.innerHeight - navHeight

			if (simulation) {
				simulation.settings.polygonSize = Math.min(512, width * 0.8, height * 0.8)
			}
		})

		avatarIntroSize = Math.min(settings.polygonSize * 1.5, width * 0.95, height * 0.95)
		avatarIntroRatio = avatarIntroSize / settings.polygonSize

		return () => {
			if (latestAnimationRequest) {
				window.cancelAnimationFrame(latestAnimationRequest)
			}
		}
	})

	const avatarOutro = (node: Element, params: any): TransitionConfig => {
		const transformScale = 1.0 - 1.0 / avatarIntroRatio
		const opacityScale = 1.0 - connectOpacity

		// TODO: Maybe actually calculate the stroke width?

		return {
			delay: params.delay || 0,
			duration: params.duration || 2000,
			easing: params.easing || quintOut,

			css: (t, u) => `
                stroke-width: ${1.0 - u * 0.7};
                transform: scale(${1.0 - u * transformScale});
                opacity: ${1.0 - u * opacityScale};
            `,
		}
	}

	const outroDuration: number = 2000
</script>

<div
	class="hero-container"
	style="--width: {width}px; --height: {height ? `${height}px` : '100vh'}"
>
	{#if !outroComplete}
		{#if !introComplete}
			<div class="hero--intro" out:avatarOutro on:outroend={onOutroComplete}>
				<AvatarIcon
					on:introend={() => {
						introComplete = true
					}}
					stroke
					strokeWidth="inherit"
					animate
					size="{avatarIntroSize}px"
				/>
			</div>
		{/if}
	{:else}
		<div class="hero--main">
			<canvas id="hero--canvas" {width} {height} />
			<div class="text">
				<p in:fade>Hi! I'm Tim</p>
				<p in:fade={{ delay: 1000 }} class="skill">
					<TextRotator initialDelay={1000} interval={1500} items={skills} />
				</p>
			</div>
			<p in:fly={{ delay: 3000, duration: 500, x: -200 }} class="wip-text">
				This site is currently in development, but you can follow its development on
				<a href="https://github.com/flmng0/flmng0.github.io">GitHub</a>.
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

		& > .text {
			font-weight: 500;
			letter-spacing: 0.08em;
			position: absolute;
			top: 45%;
			left: calc(50% + 1em);
			transform: translate(-50%, -50%);

			width: 20ch;
			min-height: 7.5ch;

			font-size: 2rem;

			user-select: none;
		}

		p {
			margin: 0.5em;
		}

		.skill {
			color: var(--color-main);
		}
	}

	.wip-text {
		position: absolute;
		bottom: 5em;
		font-size: 1.2em;
		font-weight: 200;

		left: 50%;
		transform: translateX(-50%);

		width: min(100%, 30ch);
		color: var(--color-fg-secondary);

		a {
			color: var(--color-main);
		}
	}
</style>
