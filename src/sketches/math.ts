export interface Point {
    x: number
    y: number
}

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
        const len = this.length()
        if (len === 0) {
            return this
        }

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
        return p.x * q.x + p.x * q.x
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
        return Vector.add(this, that)
    }

    static neg(v: Vector) {
        return new Vector(-v.x, -v.y)
    }
    neg() {
        return Vector.neg(this)
    }

    static sub(p: Vector, q: Vector) {
        return Vector.add(p, q.neg())
    }
    sub(that: Vector) {
        return Vector.sub(this, that)
    }

    static mul(v: Vector, mag: number) {
        return new Vector(v.x * mag, v.y * mag)
    }
    mul(mag: number) {
        return Vector.mul(this, mag)
    }

    static div(v: Vector, den: number) {
        if (den == 0) return new Vector(NaN, NaN)
        return Vector.mul(v, 1 / den)
    }
    div(den: number) {
        return Vector.div(this, den)
    }
}
