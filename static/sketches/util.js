/**
 * @param {MouseEvent | Touch} e
 * @param {HTMLCanvasElement} cvs
 * @param {CanvasRenderingContext2D?} ctx
 *
 * @returns {Vector}
 */
export function computeMousePos(e, cvs, ctx) {
	const rect = cvs.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;

	const scaleX = cvs.width / rect.width;
	const scaleY = cvs.height / rect.height;

	const canvasX = x * scaleX;
	const canvasY = y * scaleY;

	if (ctx) {
		const matrix = ctx.getTransform();
		const inverse = matrix.inverse();

		const result = inverse.transformPoint({
			x: canvasX,
			y: canvasY,
		});

		return new Vector(result.x, result.y);
	} else {
		return new Vector(canvasX, canvasY);
	}
}

export class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	static zero() {
		return new Vector(0, 0);
	}

	normalize() {
		this.mul(1 / this.length());
	}

	lengthSq() {
		return Vector.dot(this, this);
	}
	length() {
		return Math.sqrt(this.lengthSq());
	}

	static dot(p, q) {
		return p.x * q.x + p.y * q.y;
	}
	dot(that) {
		return Vector.dot(this, that);
	}

	static distSq(p, q) {
		return Vector.sub(q, p).lengthSq();
	}
	distSq(that) {
		return Vector.distSq(this, that);
	}

	static dist(p, q) {
		return Math.sqrt(Vector.distSq(p, q));
	}
	dist(that) {
		return Vector.dist(this, that);
	}

	static add(p, q) {
		return new Vector(p.x + q.x, p.y + q.y);
	}
	add(that) {
		this.x += that.x;
		this.y += that.y;
		return this;
	}

	static neg(v) {
		return new Vector(-v.x, -v.y);
	}
	neg() {
		this.x *= -1;
		this.y *= -1;
		return this;
	}

	static sub(p, q) {
		return Vector.add(p, Vector.neg(q));
	}
	sub(that) {
		this.add(Vector.neg(that));
		return this;
	}

	static mul(v, n) {
		return new Vector(v.x * n, v.y * n);
	}
	mul(n) {
		this.x *= n;
		this.y *= n;
		return this;
	}

	static div(v, n) {
		if (n == 0) return;
		return new Vector(v.x / n, v.y / n);
	}
	div(n) {
		if (n == 0) return;
		this.mul(1 / n);
		return this;
	}
}
