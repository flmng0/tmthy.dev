/**
 * @typedef {Object} State
 *
 * @property {number} t - The current time in seconds since the start of the sketch.
 * @property {number} dt - The time in seconds since the last frame.
 * @property {CanvasRenderingContext2D} ctx - 2D rendering context of the canvas.
 * @property {HTMLCanvasElement} cvs - The sketch canvas.
 */

/**
 * Draw-loop callback method for running a sketch.
 *
 * @callback DrawCallback
 *
 * @param {State} state - The current state of the sketch.
 *
 * @returns {undefined}
 */

/**
 * Callback called once, before the sketch is run.
 *
 * @callback InitCallback
 *
 * @param {State} state - The current state of the sketch.
 *
 * @returns {undefined}
 */

/**
 * @typedef {Object} RunOptions
 *
 * @property {InitCallback} init - Callback to call before the start of a sketch.
 * @property {HTMLCanvasElement} cvs - Canvas to use instead of #sketch-canvas.
 */

/**
 * Run a sketch, given a draw callback.
 *
 * @param {DrawCallback} drawFn - Draw callback run every tick of the gameloop
 * @param {RunOptions} options - Options for the sketch.
 *
 * @return {undefined}
 */
export function run(drawFn, options) {
	options = options || {}

	const state = {
		t: null,
		dt: null,
		ctx: null,
		cvs: null,
	}

	const tick = (t) => {
		const ts = t / 1000
		state.dt = Math.min(ts - state.t, 0.1)
		state.t = ts

		drawFn(state)

		window.requestAnimationFrame(tick)
	}

	window.requestAnimationFrame((t) => {
		const { init, cvs } = options

		state.t = t
		state.dt = 0

		if (cvs) {
			state.cvs = cvs
		} else {
			state.cvs = document.querySelector('#sketch-canvas')
		}

		if (state.cvs == null) {
			console.error('No canvas to use!')
			return
		}

		state.ctx = state.cvs.getContext('2d')

		if (init) {
			init(state)
		}

		window.requestAnimationFrame(tick)
	})
}

/**
 * @param {MouseEvent | Touch} e
 * @param {HTMLCanvasElement} cvs
 * @param {CanvasRenderingContext2D?} ctx
 *
 * @returns {Vector}
 */
export function computeMousePos(e, cvs, ctx) {
	const rect = cvs.getBoundingClientRect()
	const x = e.clientX - rect.left
	const y = e.clientY - rect.top

	const scaleX = cvs.width / rect.width
	const scaleY = cvs.height / rect.height

	const canvasX = x * scaleX
	const canvasY = y * scaleY

	if (ctx) {
		const matrix = ctx.getTransform()
		const inverse = matrix.inverse()

		const result = inverse.transformPoint({
			x: canvasX,
			y: canvasY,
		})

		return new Vector(result.x, result.y)
	} else {
		return new Vector(canvasX, canvasY)
	}
}

export class Vector {
	constructor(x, y) {
		this.x = x
		this.y = y
	}

	static zero() {
		return new Vector(0, 0)
	}

	normalize() {
		this.mul(1 / this.length())
	}

	lengthSq() {
		return Vector.dot(this, this)
	}
	length() {
		return Math.sqrt(this.lengthSq())
	}

	static dot(p, q) {
		return p.x * q.x + p.y * q.y
	}
	dot(that) {
		return Vector.dot(this, that)
	}

	static distSq(p, q) {
		return Vector.sub(q, p).lengthSq()
	}
	distSq(that) {
		return Vector.distSq(this, that)
	}

	static dist(p, q) {
		return Math.sqrt(Vector.distSq(p, q))
	}
	dist(that) {
		return Vector.dist(this, that)
	}

	static add(p, q) {
		return new Vector(p.x + q.x, p.y + q.y)
	}
	add(that) {
		this.x += that.x
		this.y += that.y
		return this
	}

	static neg(v) {
		return new Vector(-v.x, -v.y)
	}
	neg() {
		this.x *= -1
		this.y *= -1
		return this
	}

	static sub(p, q) {
		return Vector.add(p, Vector.neg(q))
	}
	sub(that) {
		this.add(Vector.neg(that))
		return this
	}

	static mul(v, n) {
		return new Vector(v.x * n, v.y * n)
	}
	mul(n) {
		this.x *= n
		this.y *= n
		return this
	}

	static div(v, n) {
		if (n == 0) return
		return new Vector(v.x / n, v.y / n)
	}
	div(n) {
		if (n == 0) return
		this.mul(1 / n)
		return this
	}
}
