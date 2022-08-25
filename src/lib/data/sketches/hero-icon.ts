import { Vector } from '../sketch'
import type { Point, Sketch } from '../sketch'

import displays from '$lib/home/displays'

class Particle {
	pos: Vector
	vel: Vector
	acc: Vector

	constructor(pos: Point) {
		this.pos = Vector.fromPoint(pos)
		this.vel = Vector.zero()
		this.acc = Vector.zero()
	}

	applyForce(force: Vector) {
		this.acc.add(force)
	}

	update(dt: number) {
		this.vel.add(Vector.mul(this.acc, dt))
		this.pos.add(Vector.mul(this.vel, dt))
		this.acc.mul(0)
	}
}

function shuffle<T>(array: Array<T>) {
	for (let i = array.length - 1; i > 0; i--) {
		let randIdx = Math.floor(Math.random() * (i + 1))

		;[array[i], array[randIdx]] = [array[randIdx], array[i]]
	}
}

export interface Icon {
	points: Point[]
	connections: [number, number][]
}

export interface ProcessedIcon extends Icon {
	distances: number[]
}

export interface Settings {
	returnFactor: number
	frictionFactor: number

	minRepelDistance: number
	repelFactor: number
}

export class DynamicIconSimulation {
	settings: Settings

	currentIcon: Icon

	particles: Particle[]

	lastUpdate: number

	constructor(startIcon: Icon, settings: Settings) {
		this.settings = settings

		this.currentIcon = startIcon

		this.particles = this.currentIcon.points.map(() => this.randomPolarParticle(0.5))

		this.lastUpdate = 0
	}

	randomPolarParticle(maxRadius: number) {
		const newPoint = polarPoint(Math.random() * Math.PI * 2, Math.random() * maxRadius)
		const newParticle = new Particle(newPoint)

		return newParticle
	}

	set(icon: Icon) {
		const current = {
			icon: this.currentIcon,
			length: this.currentIcon.points.length,
		}

		const next = {
			icon,
			length: icon.points.length,
		}

		if (current.length !== next.length) {
			if (current.length < next.length) {
				const diff = next.length - current.length

				const newParticles = Array.from({ length: diff }, () => this.randomPolarParticle(0.5))
				this.particles.push(...newParticles)
			} else if (current.length > next.length) {
				this.particles = this.particles.slice(0, next.length)
			}
		}

		shuffle(this.particles)

		this.currentIcon = next.icon
	}

	update(t: number) {
		if (this.lastUpdate === 0) {
			this.lastUpdate = t
			return
		}

		const settings = this.settings

		const dt = Math.min(0.1, (t - this.lastUpdate) / 1000)
		this.lastUpdate = t

		for (let i = 0; i < this.particles.length; i += 1) {
			const particle = this.particles[i]
			const originPoint = this.currentIcon.points[i]
			const origin = Vector.fromPoint(originPoint)

			// Return to origin
			const returnForce = Vector.sub(origin, particle.pos).mul(settings.returnFactor)
			particle.applyForce(returnForce)

			// Friction
			const frictionForce = Vector.neg(particle.vel).mul(settings.frictionFactor)
			particle.applyForce(frictionForce)

			// Do the needful
			particle.update(dt)
		}
	}
}

interface Data {
	canvas: HTMLCanvasElement
	context: CanvasRenderingContext2D
	simulation: DynamicIconSimulation
	icons: Icon[]
	iconIndex: number
	polygonSize: number
	lastTransition: number
	transitionDelay: number
	fadeDuration: number
	maxConnectWidth: number
	fadeMinWidth: number
}

export const HeroIcon: Sketch<Data> = {
	init(canvas) {
		const context = canvas.getContext('2d')!

		const processedIcons = exampleIcons.map((icon) => {
			const distances = icon.connections.map(([fromIdx, toIdx]) => {
				const fromPoint = icon.points[fromIdx]
				const toPoint = icon.points[toIdx]

				const from = Vector.fromPoint(fromPoint)
				const to = Vector.fromPoint(toPoint)

				return from.dist(to)
			})

			return {
				distances,
				...icon,
			}
		})
		const settings: Settings = {
			returnFactor: 16.0,
			frictionFactor: 2.0,
			minRepelDistance: 0.01,
			repelFactor: 0.2,
		}

		const simulation = new DynamicIconSimulation(processedIcons[0], settings)

		return {
			canvas,
			context,
			simulation: simulation,
			icons: processedIcons,
			iconIndex: 0,
			polygonSize: 400.0,
			transitionDelay: 5000,
			fadeDuration: 500,
			lastTransition: 0,
			maxConnectWidth: 2.0,
			fadeMinWidth: 0.4,
		}
	},

	draw(data, t) {
		if (data.lastTransition === 0) {
			data.lastTransition = t
		}

		data.context.clearRect(0, 0, data.canvas.width, data.canvas.height)

		const sim = data.simulation
		const scale = data.polygonSize
		const ctx = data.context

		if (t - data.lastTransition > data.transitionDelay) {
			data.iconIndex = (data.iconIndex + 1) % data.icons.length
			sim.set(data.icons[data.iconIndex])
			data.lastTransition = t
		}

		sim.update(t)

		ctx.fillStyle = '#000'
		ctx.strokeStyle = '#222'
		ctx.lineWidth = 1.0

		ctx.translate(
			(data.canvas.width - data.polygonSize) / 2,
			(data.canvas.height - data.polygonSize) / 2,
		)

		for (const particle of sim.particles) {
			ctx.beginPath()
			ctx.arc(particle.pos.x * scale, particle.pos.y * scale, 2, 0, Math.PI * 2)
			ctx.fill()
		}

		const currentIcon = sim.currentIcon as ProcessedIcon

		for (let i = 0; i < currentIcon.connections.length; i += 1) {
			const [fromIdx, toIdx] = currentIcon.connections[i]

			const originalDist = currentIcon.distances[i]

			const from = sim.particles[fromIdx].pos
			const to = sim.particles[toIdx].pos

			const dist = from.dist(to)
			const diff = Math.abs(dist - originalDist)

			// Get distance time til/since transition.
			const tdl = Math.abs(data.lastTransition - t)
			const tdn = Math.abs(data.lastTransition + data.transitionDelay - t)
			const mtd = Math.min(tdl, tdn)

			const width = data.maxConnectWidth * (1.0 - diff * 1.5)

			if (mtd < data.fadeDuration) {
				ctx.lineWidth = Math.max(
					data.fadeMinWidth,
					(mtd / data.fadeDuration) * data.maxConnectWidth,
				)
			} else {
				ctx.lineWidth = Math.max(data.fadeMinWidth, width)
			}

			ctx.beginPath()
			ctx.moveTo(from.x * scale, from.y * scale)
			ctx.lineTo(to.x * scale, to.y * scale)
			ctx.stroke()
		}

		ctx.resetTransform()
	},
}

export default HeroIcon

const point = (x: number, y: number): Point => ({ x, y })
const polarPoint = (a: number, m: number): Point => point(m * Math.cos(a), m * Math.sin(a))

const makeCircleThing = (n: number): Icon => {
	const points = Array.from({ length: n }, (_, i) => {
		const a = 2 * Math.PI * (i / n)
		const x = 0.5 + 0.5 * Math.cos(a)
		const y = 0.5 + 0.5 * Math.sin(a)

		return point(x, y)
	})

	const connections = points.flatMap((_, i) => [
		[i, (i + 1) % n],
		[i, (i + 2) % n],
		[i, (i + 3) % n],
	])

	return { points, connections: connections as [number, number][] }
}

const exampleIcons: Icon[] = [
	{
		// Square
		points: [point(0, 0), point(1, 0), point(1, 1), point(0, 1)].map(({ x, y }) => {
			const newSize = 0.65
			const translation = (1.0 - 0.65) / 2

			return {
				x: x * newSize + translation,
				y: y * newSize + translation,
			}
		}),
		connections: [
			[0, 1],
			[1, 2],
			[2, 3],
			[3, 0],
			[0, 2],
			[1, 3],
		],
	},
	makeCircleThing(8),
	displays.avatar.icon,
]
