export interface SketchFrontmatter {
	name?: string
	brief?: string
	screenshot?: string
	source?: string
}

export const sketchesDir = 'src/sketches'

interface ContextMap {
	'2d': CanvasRenderingContext2D
	webgl: WebGLRenderingContext
	webgl2: WebGL2RenderingContext
}

export interface Sketch<D extends Record<string, any>> {
	init(canvas: HTMLCanvasElement): D | null
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
