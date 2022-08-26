export interface SketchDetails {
	date: string
	name: string
	brief: string
	screenshot: string
}

export function computePointPos(
	point: { clientX: number; clientY: number },
	cvs: HTMLCanvasElement,
): Point {
	const rect = cvs.getBoundingClientRect()
	const scaleX = cvs.width / rect.width
	const scaleY = cvs.height / rect.height
	const x = point.clientX - rect.left
	const y = point.clientY - rect.top

	return { x: x * scaleX, y: y * scaleY }
}

export const sketchesDir = 'src/lib/data/sketches'

export type CancelCallback = () => void
export type PauseCallback = (paused: boolean) => void

export function runSketch<D>(
	sketch: Sketch<D>,
	canvas: HTMLCanvasElement,
): [CancelCallback, PauseCallback] {
	const data = sketch.init(canvas)

	let rafIdx: number
	const tick = (t: number) => {
		sketch.draw!(data!, t)
		rafIdx = requestAnimationFrame(tick)
	}

	if (sketch.draw !== null) {
		rafIdx = requestAnimationFrame(tick)
	}

	const cancel = () => {
		cancelAnimationFrame(rafIdx)
	}

	const setPaused = (paused: boolean) => {
		if (paused) {
			cancelAnimationFrame(rafIdx)
			return
		}
		rafIdx = requestAnimationFrame(tick)
	}

	return [cancel, setPaused]
}

export interface Sketch<D> {
	init(canvas: HTMLCanvasElement): D
	draw?(data: D, t: number): void
}

export interface Point {
	x: number
	y: number
}

export type Triangle = [Point, Point, Point]

export class Vector {
	x: number
	y: number

	constructor(x: number, y: number) {
		this.x = x
		this.y = y
	}

	static zero() {
		return new Vector(0, 0)
	}

	static fromPoint(point: Point) {
		return new Vector(point.x, point.y)
	}

	normalize() {
		this.mul(1 / this.length())
		return this
	}

	lengthSq() {
		return Vector.dot(this, this)
	}
	length() {
		return Math.sqrt(this.lengthSq())
	}

	static dot(p: Vector, q: Vector) {
		return p.x * q.x + p.y * q.y
	}
	dot(that: Vector) {
		return Vector.dot(this, that)
	}

	static distSq(p: Vector, q: Vector) {
		return Vector.sub(q, p).lengthSq()
	}
	distSq(that: Vector) {
		return Vector.distSq(this, that)
	}

	static dist(p: Vector, q: Vector) {
		return Math.sqrt(Vector.distSq(p, q))
	}
	dist(that: Vector) {
		return Vector.dist(this, that)
	}

	static add(p: Vector, q: Vector) {
		return new Vector(p.x + q.x, p.y + q.y)
	}
	add(that: Vector) {
		this.x += that.x
		this.y += that.y
		return this
	}

	static neg(v: Vector) {
		return new Vector(-v.x, -v.y)
	}
	neg() {
		this.x *= -1
		this.y *= -1
		return this
	}

	static sub(p: Vector, q: Vector) {
		return Vector.add(p, Vector.neg(q))
	}
	sub(that: Vector) {
		this.add(Vector.neg(that))
		return this
	}

	static mul(v: Vector, n: number) {
		return new Vector(v.x * n, v.y * n)
	}
	mul(n: number) {
		this.x *= n
		this.y *= n
		return this
	}

	static div(v: Vector, n: number) {
		if (n == 0) return new Vector(NaN, NaN)
		return Vector.mul(v, 1 / n)
	}
	div(n: number) {
		if (n == 0) return new Vector(NaN, NaN)
		this.mul(1 / n)
		return this
	}
}
