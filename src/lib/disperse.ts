// TODO: Move Point to math? It's only an interface though...
import { Vector } from './math'
import { Point } from './types'

export interface Settings {
	minRepelDist: number // = 100

	repelStrength: number // = 20
	returnStrength: number // = 10
	frictionStrength: number // = 1.5

	minConnectWidth: number
	polygonSize: number
}

class Particle {
	origin: Vector
	pos: Vector
	vel: Vector
	acc: Vector

	constructor(origin: Point) {
		this.origin = Vector.fromPoint(origin)
		this.pos = Vector.fromPoint(origin)
		this.vel = Vector.zero()
		this.acc = Vector.zero()
	}

	applyForce(force: Vector) {
		this.acc.add(force)
	}

	applyReturnForce(settings: Settings) {
		const { returnStrength } = settings

		const force = Vector.sub(this.origin, this.pos).mul(returnStrength)

		this.applyForce(force)
	}

	applyFriction(settings: Settings) {
		const { frictionStrength } = settings

		const force = Vector.neg(this.vel).mul(frictionStrength)

		this.applyForce(force)
	}

	update(settings: Settings, dt: number) {
		this.applyReturnForce(settings)
		this.applyFriction(settings)

		this.vel.add(Vector.mul(this.acc, dt))
		this.pos.add(Vector.mul(this.vel, dt))
		this.acc.mul(0)
	}

	draw(settings: Settings, ctx: CanvasRenderingContext2D) {
		const { polygonSize } = settings

		ctx.beginPath()
		ctx.arc(this.pos.x * polygonSize, this.pos.y * polygonSize, 2, 0, Math.PI * 2)
		ctx.fill()
		ctx.closePath()
	}

	maybeRepel(settings: Settings, point: Vector | null) {
		const { minRepelDist, repelStrength, polygonSize } = settings

		if (point == null) {
			return
		}

		const scaledPos = Vector.mul(this.pos, polygonSize)

		const dd = scaledPos.distSq(point)
		if (dd > minRepelDist * minRepelDist) {
			return
		}

		const d = Math.sqrt(dd)
		const inverse = 1.0 - d / minRepelDist

		const away = Vector.sub(scaledPos, point)
			.div(polygonSize)
			.mul(inverse * repelStrength)
		this.vel.add(away)
	}
}

export interface DispersePolygon {
	points: Array<Point>
	lines: Array<[number, number]>
}

function computePointPos(
	point: { clientX: number; clientY: number },
	cvs: HTMLCanvasElement
): Point {
	const rect = cvs.getBoundingClientRect()
	const x = point.clientX - rect.left
	const y = point.clientY - rect.top

	return { x: x, y: y }
}

export class DisperseSimulation {
	settings: Settings
	mouse: Point | null
	touches: Array<Point>

	pointStyle: string
	connectStyle: string

	particles: Array<Particle>
	connections: Array<[number, number]>
	originalDistances: Array<number>

	cvs: HTMLCanvasElement
	ctx: CanvasRenderingContext2D

	t: number | null
	paused: boolean

	constructor(cvs: HTMLCanvasElement, polygon: DispersePolygon, settings: Settings) {
		this.settings = settings
		this.mouse = null
		this.touches = []

		this.pointStyle = 'white'
		this.connectStyle = 'white'

		this.particles = polygon.points.map((point) => new Particle(point))
		this.particles.forEach((particle) => {
			// particle.origin.mul(settings.polygonSize)
			// particle.pos.mul(settings.polygonSize)
		})

		this.connections = polygon.lines

		this.originalDistances = this.connections.map((connection) => {
			const from = this.particles[connection[0]].pos
			const to = this.particles[connection[1]].pos

			const p = new Vector(from.x, from.y)
			const q = new Vector(to.x, to.y)

			return p.dist(q)
		})

		this.cvs = cvs
		this.ctx = cvs.getContext('2d')

		this.t = null
		this.paused = false

		const mouseListener = (e: MouseEvent) => {
			this.mouse = computePointPos(e, cvs)
		}

		// Only listen to mouse events if the canvas is on screen.
		const observer = new IntersectionObserver(
			(entries) => {
				const cvsEntry = entries[0]
				if (cvsEntry.isIntersecting) {
					window.addEventListener('mousemove', mouseListener)
					this.paused = false
				} else {
					window.removeEventListener('mousemove', mouseListener)
					this.paused = true
				}
			},
			{
				threshold: 0.0,
			}
		)
		observer.observe(cvs)

		cvs.addEventListener('mouseleave', () => (this.mouse = null))

		const touchEv = (e: TouchEvent) => {
			const targetTouches = e.targetTouches
			this.touches = Array.from({ length: targetTouches.length }, (v, i) =>
				computePointPos(targetTouches[i], cvs)
			)
		}

		cvs.addEventListener('touchstart', touchEv)
		cvs.addEventListener('touchmove', touchEv)
		cvs.addEventListener('touchend', touchEv)
		cvs.addEventListener('touchcancel', touchEv)
	}

	draw(t: number) {
		if (this.paused) {
			return
		}

		const dt = Math.min(0.1, (this.t ? t - this.t : 0) / 1000)
		this.t = t

		const ctx = this.ctx

		ctx.clearRect(0, 0, this.cvs.width, this.cvs.height)

		const centerVec = new Vector(this.cvs.width, this.cvs.height)
			.sub(new Vector(this.settings.polygonSize, this.settings.polygonSize))
			.div(2)

		let mouseVec = null
		if (this.mouse) {
			mouseVec = new Vector(this.mouse.x, this.mouse.y).sub(centerVec)
		}

		ctx.save()
		ctx.translate(centerVec.x, centerVec.y)

		ctx.fillStyle = this.pointStyle
		ctx.strokeStyle = this.connectStyle

		for (const particle of this.particles) {
			particle.maybeRepel(this.settings, mouseVec)

			for (const touch of this.touches) {
				const touchVec = new Vector(touch.x, touch.y)
				particle.maybeRepel(this.settings, touchVec)
			}

			particle.update(this.settings, dt)
			particle.draw(this.settings, ctx)
		}

		for (let i = 0; i < this.connections.length; i++) {
			const scale = this.settings.polygonSize

			const [fromIdx, toIdx] = this.connections[i]
			const dist = this.originalDistances[i]

			const from = this.particles[fromIdx].pos
			const to = this.particles[toIdx].pos

			const d = from.dist(to)
			const diff = Math.abs(dist - d)
			ctx.lineWidth = this.settings.minConnectWidth * Math.max(0.1, 1.0 - diff * 1.5)

			ctx.beginPath()
			ctx.moveTo(from.x * scale, from.y * scale)
			ctx.lineTo(to.x * scale, to.y * scale)
			ctx.stroke()
			ctx.closePath()
		}

		ctx.restore()
	}
}