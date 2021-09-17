import { computeMousePos, run, Vector } from './framework.js'

const repelDist = 100
const repelDistSq = repelDist * repelDist
const returnStrength = 10
const repelStrength = 20
const friction = 1.5
const connectWidth = 2

class Particle {
	constructor(x, y) {
		this.origin = new Vector(x, y)
		this.pos = new Vector(x, y)
		this.vel = Vector.zero()
		this.acc = Vector.zero()
	}

	applyForce(force) {
		this.acc.add(force)
	}

	return() {
		const force = Vector.sub(this.pos, this.origin)
		const stretch = force.length()

		force.mul(-1 * returnStrength)

		this.applyForce(force)
	}

	applyFriction() {
		const force = Vector.neg(this.vel)
		force.mul(friction)

		this.applyForce(force)
	}

	update(dt) {
		this.return()
		this.applyFriction()

		this.vel.add(Vector.mul(this.acc, dt))
		this.pos.add(Vector.mul(this.vel, dt))
		this.acc.mul(0)
	}

	draw(ctx) {
		ctx.beginPath()
		ctx.arc(this.pos.x, this.pos.y, 2, 0, Math.PI * 2)
		ctx.fill()
		ctx.closePath()
	}

	maybeRepel(mouse) {
		if (mouse == null) {
			return
		}

		const dd = this.pos.distSq(mouse)
		if (dd > repelDistSq) {
			return
		}

		const d = Math.sqrt(dd)
		const inverse = 1.0 - d / repelDist

		const away = Vector.sub(this.pos, mouse).mul(inverse).mul(repelStrength)
		this.vel.add(away)
	}
}

class DisperseSketch {
	constructor(points, connections, scale) {
		this.particles = []
		this.originalDistances = []
		this.mouse = null
		this.touches = []

		this.pointColor = 'black'
		this.connectColor = 'rgba(0, 0, 0, 75%)'

		this.particles = points
		this.connections = connections
		this.scale = scale
	}

	/** @type import('./framework.js').InitCallback */
	init({ cvs, t }) {
		this.particles = this.particles.map(
			(point) => new Particle(point.x * this.scale, point.y * this.scale)
		)

		this.originalDistances = this.connections.map((connection) => {
			const from = this.particles[connection[0]].pos
			const to = this.particles[connection[1]].pos

			const p = new Vector(from.x, from.y)
			const q = new Vector(to.x, to.y)

			const d = p.dist(q)

			return d
		})

		cvs.addEventListener('mousemove', (e) => {
			this.mouse = computeMousePos(e, cvs)
		})
		cvs.addEventListener('mouseleave', () => (this.mouse = null))

		/**
		 * @param {TouchEvent} e
		 */
		const touchEv = (e) => {
			const targetTouches = e.targetTouches
			this.touches = Array.from({ length: targetTouches.length }, (v, i) =>
				computeMousePos(targetTouches[i])
			)
		}

		cvs.addEventListener('touchstart', touchEv)
		cvs.addEventListener('touchmove', touchEv)
		cvs.addEventListener('touchend', touchEv)
		cvs.addEventListener('touchcancel', touchEv)
	}

	/** @type import('./framework.js').DrawCallback */
	draw({ cvs, ctx, dt, t }) {
		ctx.clearRect(0, 0, cvs.width, cvs.height)

		const centerVec = new Vector(cvs.width, cvs.height)
			.sub(new Vector(this.scale, this.scale))
			.div(2)

		let mouseVec = null
		if (this.mouse) {
			mouseVec = new Vector(this.mouse.x, this.mouse.y).sub(centerVec)
		}

		ctx.save()
		ctx.translate(centerVec.x, centerVec.y)

		ctx.fillStyle = this.pointColor
		for (const particle of this.particles) {
			particle.maybeRepel(mouseVec)

			for (const touch of this.touches) {
				const touchVec = new Vector(touch.x, touch.y)
				particle.maybeRepel()
			}

			particle.update(dt)
			particle.draw(ctx)
		}

		ctx.strokeStyle = this.strokeStyle
		// Looped after-wards so that the updated positions are used.
		for (let i = 0; i < this.connections.length; i += 1) {
			const [fromIdx, toIdx] = this.connections[i]
			const dist = this.originalDistances[i]

			const from = this.particles[fromIdx].pos
			const to = this.particles[toIdx].pos

			const d = from.dist(to)
			const diff = Math.abs(dist - d)
			ctx.lineWidth = connectWidth * Math.max(0.1, 1.0 - diff * 0.01)

			ctx.beginPath()
			ctx.moveTo(from.x, from.y)
			ctx.lineTo(to.x, to.y)
			ctx.stroke()
			ctx.closePath()
		}

		ctx.restore()
	}
}

if (document.querySelector('#sketch-canvas')) {
	const pointCount = 10
	const points = Array.from({ length: pointCount }, (v, i) => {
		const a = 2 * Math.PI * (i / pointCount)
		const x = 0.3 * Math.cos(a)
		const y = 0.3 * Math.sin(a)

		return { x: x + 0.5, y: y + 0.5 }
	})

	let connections = []
	for (let i = 0; i < pointCount; i += 1) {
		connections.push([i, (i + 1) % pointCount])
		connections.push([i, (i + 2) % pointCount])
		connections.push([i, (i + 3) % pointCount])
	}

	const sketch = new DisperseSketch(points, connections, 600)

	run(sketch.draw.bind(sketch), { init: sketch.init.bind(sketch) })
}
// let particles = []
// let originalDistances = []
// let mouse = null
// let touches = []

// /** @type import('./framework.js').InitCallback */
// function init({ cvs, t }) {
// 	particles = points.map((point) => new Particle(point.x * polygonScale, point.y * polygonScale))

// 	originalDistances = connections.map((connection) => {
// 		const from = particles[connection[0]].pos
// 		const to = particles[connection[1]].pos

// 		const p = new Vector(from.x, from.y)
// 		const q = new Vector(to.x, to.y)

// 		const d = p.dist(q)

// 		return d
// 	})

// 	cvs.addEventListener('mousemove', (e) => {
// 		mouse = computeMousePos(e, cvs)
// 	})
// 	cvs.addEventListener('mouseleave', () => (mouse = null))

// 	/**
// 	 * @param {TouchEvent} e
// 	 */
// 	function touchEv(e) {
// 		const targetTouches = e.targetTouches
// 		touches = Array.from({ length: targetTouches.length }, (v, i) =>
// 			computeMousePos(targetTouches[i])
// 		)
// 	}

// 	cvs.addEventListener('touchstart', touchEv)
// 	cvs.addEventListener('touchmove', touchEv)
// 	cvs.addEventListener('touchend', touchEv)
// 	cvs.addEventListener('touchcancel', touchEv)
// }

// /** @type import('./framework.js').DrawCallback */
// function draw({ cvs, ctx, dt, t }) {
// 	ctx.clearRect(0, 0, cvs.width, cvs.height)

// 	const centerVec = new Vector(cvs.width, cvs.height)
// 		.sub(new Vector(polygonScale, polygonScale))
// 		.div(2)

// 	let mouseVec = null
// 	if (mouse) {
// 		mouseVec = new Vector(mouse.x, mouse.y).sub(centerVec)
// 	}

// 	ctx.save()
// 	ctx.translate(centerVec.x, centerVec.y)

// 	ctx.fillStyle = 'black'
// 	for (const particle of particles) {
// 		particle.maybeRepel(mouseVec)

// 		for (const touch of touches) {
// 			const touchVec = new Vector(touch.x, touch.y)
// 			particle.maybeRepel()
// 		}

// 		particle.update(dt)
// 		particle.draw(ctx)
// 	}

// 	// Looped after-wards so that the updated positions are used.
// 	for (let i = 0; i < connections.length; i += 1) {
// 		const [fromIdx, toIdx] = connections[i]
// 		const dist = originalDistances[i]

// 		const from = particles[fromIdx].pos
// 		const to = particles[toIdx].pos

// 		const d = from.dist(to)
// 		const diff = Math.abs(dist - d)
// 		ctx.lineWidth = connectWidth * Math.max(0.1, 1.0 - diff * 0.01)

// 		ctx.beginPath()
// 		ctx.moveTo(from.x, from.y)
// 		ctx.lineTo(to.x, to.y)
// 		ctx.stroke()
// 		ctx.closePath()
// 	}

// 	ctx.restore()
// }

// if (document.querySelector('#sketch-canvas')) {
// 	run(draw, { init })
// }
