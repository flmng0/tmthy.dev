import { computeMousePos, run, Vector } from "./framework.js";

// Pre-calculated binomal coefficients for n in [2, 8].
const knownCoefficients = [
	[1, 1],
	[1, 2, 1],
	[1, 3, 3, 1],
	[1, 4, 6, 4, 1],
	[1, 5, 10, 10, 5, 1],
	[1, 6, 15, 20, 15, 6, 1],
	[1, 7, 21, 35, 35, 21, 7, 1],
	[1, 8, 28, 56, 70, 56, 28, 8, 1],
];

class Bezier {
	constructor() {
		this.reset();
	}

	add(points) {
		this.control.push(points);
		this.calculateCoefficients();
	}

	reset() {
		this.control = [];
		this.coefficients = [];
	}

	get(t) {
		const n = this.control.length;

		const getFactor = (i) => this.coefficients[i] * Math.pow(1 - t, n - 1 - i) * Math.pow(t, i);

		return this.control.reduce((acc, point, idx) => {
			const factor = getFactor(idx);
			acc.add({
				x: point.x * factor,
				y: point.y * factor,
			});
			return acc;
		}, Vector.zero());
	}

	calculateCoefficients() {
		const n = this.control.length - 1;

		if (n < knownCoefficients.length) {
			this.coefficients = knownCoefficients[n - 1];
			return;
		}

		const c = Array.from({ length: Math.floor(n / 2) + 1 }, (_, k) => {
			if (k == 0 || k == n) return 1;

			let res,
				acc = 1;

			for (let i = acc; i <= n; i += 1) {
				acc *= i;
				if (i == k) res = acc;
				if (i == n - k) res *= acc;
				if (i == n) res = acc / res;
			}

			return res;
		});

		this.coefficients = [...c];

		if (n % 2 == 0) {
			c.reverse();
			c.shift();
			this.coefficients.push(...c);
		} else {
			this.coefficients.push(...c.reverse());
		}
	}
}

const bezier = new Bezier();
const segments = 100;
let dirty = true;

/** @type import("./framework").InitCallback */
function init({ cvs, ctx }) {
	cvs.addEventListener("click", (e) => {
		const pos = computeMousePos(e, cvs);
		dirty = true;
		bezier.add(pos);
	});

	cvs.addEventListener("keypress", (e) => {
		switch (e.key) {
			case " ":
				bezier.reset();
		}
	});

	ctx.fillStyle = "red";
	ctx.strokeStyle = "black";
}

/** @type import("./framework").DrawCallback */
function draw({ cvs, ctx }) {
	if (!dirty) {
		return;
	}
	dirty = false;

	ctx.clearRect(0, 0, cvs.width, cvs.height);

	if (bezier.control.length < 2) {
		return;
	}

	ctx.beginPath();
	const drawPoint = (p) => {
		ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
	};
	drawPoint(bezier.control[0]);
	drawPoint(bezier.control[bezier.control.length - 1]);
	ctx.fill();

	ctx.save();
	ctx.beginPath();
	ctx.moveTo(...bezier.control[0]);
	let prev = bezier.control[0];
	for (let i = 0; i <= segments; i += 1) {
		const t = i / segments;
		ctx.lineTo(...bezier.get(t));
	}
	ctx.stroke();
	ctx.restore();
}

const cvs = document.querySelector("#sketch-canvas");
if (cvs) {
	run(draw, { init, cvs });
}
