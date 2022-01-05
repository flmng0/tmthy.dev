function computeMousePos(e, cvs, ctx) {
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

const repelDist = 100;
const repelDistSq = repelDist * repelDist;
const returnStrength = 10;
const repelStrength = 20;
const friction = 1.5;
const connectWidth = 2;

class Particle {
	constructor(x, y) {
		this.origin = new Vector(x, y);
		this.pos = new Vector(x, y);
		this.vel = Vector.zero();
		this.acc = Vector.zero();
	}

	applyForce(force) {
		this.acc.add(force);
	}

	return() {
		const force = Vector.sub(this.pos, this.origin);
		const stretch = force.length();

		force.mul(-1 * returnStrength);

		this.applyForce(force);
	}

	applyFriction() {
		const force = Vector.neg(this.vel);
		force.mul(friction);

		this.applyForce(force);
	}

	update(dt) {
		this.return();
		this.applyFriction();

		this.vel.add(Vector.mul(this.acc, dt));
		this.pos.add(Vector.mul(this.vel, dt));
		this.acc.mul(0);
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, 2, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();
	}

	maybeRepel(mouse) {
		if (mouse == null) {
			return;
		}

		const dd = this.pos.distSq(mouse);
		if (dd > repelDistSq) {
			return;
		}

		const d = Math.sqrt(dd);
		const inverse = 1.0 - d / repelDist;

		const away = Vector.sub(this.pos, mouse).mul(inverse).mul(repelStrength);
		this.vel.add(away);
	}
}

let mouse = null;
let touches = [];

const polygonScale = 300;

const pointCount = 10;
const particles = Array.from({ length: pointCount }, (v, i) => {
	const a = 2 * Math.PI * (i / pointCount);
	const x = polygonScale * (0.5 * Math.cos(a) + 0.5);
	const y = polygonScale * (0.5 * Math.sin(a) + 0.5);

	return new Particle(x, y);
});

let connections = [];
for (let i = 0; i < pointCount; i += 1) {
	connections.push([i, (i + 1) % pointCount]);
	connections.push([i, (i + 2) % pointCount]);
	connections.push([i, (i + 3) % pointCount]);
}

let originalDistances = connections.map((connection) => {
	const from = particles[connection[0]].pos;
	const to = particles[connection[1]].pos;

	const p = new Vector(from.x, from.y);
	const q = new Vector(to.x, to.y);

	const d = p.dist(q);

	return d;
});

/** @type import('./framework.js').InitCallback */
export function init({ cvs, t }) {
	cvs.addEventListener("mousemove", (e) => {
		mouse = computeMousePos(e, cvs);
	});
	cvs.addEventListener("mouseleave", () => (mouse = null));

	/**
	 * @param {TouchEvent} e
	 */
	const touchEv = (e) => {
		const targetTouches = e.targetTouches;
		touches = Array.from({ length: targetTouches.length }, (v, i) =>
			computeMousePos(targetTouches[i], cvs)
		);
	};

	cvs.addEventListener("touchstart", touchEv);
	cvs.addEventListener("touchmove", touchEv);
	cvs.addEventListener("touchend", touchEv);
	cvs.addEventListener("touchcancel", touchEv);
}

/** @type import('./framework.js').DrawCallback */
export function draw({ cvs, ctx, dt, t }) {
	ctx.clearRect(0, 0, cvs.width, cvs.height);

	const centerVec = new Vector(cvs.width, cvs.height)
		.sub(new Vector(polygonScale, polygonScale))
		.div(2);

	let mouseVec = null;
	if (mouse) {
		mouseVec = new Vector(mouse.x, mouse.y).sub(centerVec);
	}

	ctx.save();
	ctx.translate(centerVec.x, centerVec.y);

	ctx.fillStyle = "black";
	for (const particle of particles) {
		particle.maybeRepel(mouseVec);

		for (const touch of touches) {
			const touchVec = new Vector(touch.x, touch.y);
			particle.maybeRepel(touchVec);
		}

		particle.update(dt);
		particle.draw(ctx);
	}

	ctx.strokeStyle = "rgba(0, 0, 0, 75%)";
	// Looped after-wards so that the updated positions are used.
	for (let i = 0; i < connections.length; i += 1) {
		const [fromIdx, toIdx] = connections[i];
		const dist = originalDistances[i];

		const from = particles[fromIdx].pos;
		const to = particles[toIdx].pos;

		const d = from.dist(to);
		const diff = Math.abs(dist - d);
		ctx.lineWidth = connectWidth * Math.max(0.1, 1.0 - diff * 0.01);

		ctx.beginPath();
		ctx.moveTo(from.x, from.y);
		ctx.lineTo(to.x, to.y);
		ctx.stroke();
		ctx.closePath();
	}

	ctx.restore();
}

// if (document.querySelector("#sketch-canvas")) {
// 	run(draw, { init });
// }
