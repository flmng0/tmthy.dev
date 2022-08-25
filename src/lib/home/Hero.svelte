<script lang="ts">
	import { canvasToClientSize } from '$lib/actions'
	import { DynamicIconSimulation, type ProcessedIcon } from '$lib/data/sketches/hero-icon'
	import { theme } from '$lib/stores'

	export let size: number
	export let icon: ProcessedIcon

	let currentTime: number
	let transitionTime: number

	$: strokeStyle = $theme === 'dark' ? '#ddd' : '#666'

	const transitionDuration = 500
	const halfDuration = transitionDuration / 2
	const maxWidth = 3.0
	const minWidth = 0.1

	const sim = new DynamicIconSimulation(icon, {
		returnFactor: 14.0,
		frictionFactor: 4.0,
		minRepelDistance: 0.01,
		repelFactor: 0.2,
	})

	let isFirst = true
	const set = (nextIcon: ProcessedIcon) => {
		if (isFirst) {
			isFirst = false
			return
		}
		setTimeout(() => {
			sim.set(nextIcon)
		}, halfDuration)
		transitionTime = currentTime
	}
	$: set(icon)

	const run = (cvs: HTMLCanvasElement) => {
		const ctx = cvs.getContext('2d')!

		let rafIdx: number

		const tick = (t: number) => {
			currentTime = t

			sim.update(t)

			ctx.clearRect(0, 0, cvs.width, cvs.height)
			ctx.strokeStyle = strokeStyle

			ctx.translate((cvs.width - size) / 2, (cvs.height - size) / 2)

			const currentIcon = sim.currentIcon as ProcessedIcon

			for (let i = 0; i < currentIcon.connections.length; i += 1) {
				const [aIdx, bIdx] = currentIcon.connections[i]

				const originalDist = currentIcon.distances[i]

				const a = sim.particles[aIdx].pos
				const b = sim.particles[bIdx].pos

				const actualDist = a.dist(b)
				const diff = Math.abs(actualDist - originalDist)

				const width = maxWidth * (1.0 - diff * 1.5)

				const dt = t - transitionTime
				if (dt < transitionDuration) {
					// Distance til half-way of
					const dm = Math.abs(dt - halfDuration) / halfDuration

					ctx.lineWidth = Math.max(minWidth, width * dm)
				} else {
					ctx.lineWidth = Math.max(minWidth, width)
				}

				ctx.beginPath()
				ctx.moveTo(a.x * size, a.y * size)
				ctx.lineTo(b.x * size, b.y * size)
				ctx.stroke()
			}

			ctx.resetTransform()

			rafIdx = requestAnimationFrame(tick)
		}

		rafIdx = requestAnimationFrame((t) => {
			currentTime = t
			sim.lastUpdate = t
			rafIdx = requestAnimationFrame(tick)
		})

		return {
			destroy: () => {
				cancelAnimationFrame(rafIdx)
			},
		}
	}
</script>

<canvas use:run use:canvasToClientSize />

<style lang="scss">
	canvas {
		width: 100%;
		height: 100%;
		display: block;
	}
</style>
