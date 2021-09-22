import { Point } from './types'

// Pretty much yoinked one-for-one from `/static/sketches/framework.js`
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

	static neg(v) {
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
		if (n == 0) return
		return Vector.mul(v, 1 / n)
	}
	div(n: number) {
		if (n == 0) return
		this.mul(1 / n)
		return this
	}
}
