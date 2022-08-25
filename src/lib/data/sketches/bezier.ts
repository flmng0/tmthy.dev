import { type Point, type Sketch, Vector, computePointPos } from '$lib/data/sketch'

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
]

class Bezier {
	control: Vector[]
	coefficients: number[]

	constructor() {
		this.control = []
		this.coefficients = []
	}

	add(point: Vector) {
		this.control.push(point)
		this.calculateCoefficients()
	}

	reset() {
		this.control = []
		this.coefficients = []
	}

	get(t: number) {
		const n = this.control.length

		const getFactor = (i: number) =>
			this.coefficients[i] * Math.pow(1 - t, n - 1 - i) * Math.pow(t, i)

		return this.control.reduce((acc, point, idx) => {
			const factor = getFactor(idx)
			acc.add(new Vector(point.x * factor, point.y * factor))
			return acc
		}, Vector.zero())
	}

	calculateCoefficients() {
		const n = this.control.length - 1

		if (n < knownCoefficients.length) {
			this.coefficients = knownCoefficients[n - 1]
			return
		}

		const c = Array.from({ length: Math.floor(n / 2) + 1 }, (_, k) => {
			if (k == 0 || k == n) return 1

			let res = 0
			let acc = 1

			for (let i = acc; i <= n; i += 1) {
				acc *= i
				if (i == k) res = acc
				if (i == n - k) res *= acc
				if (i == n) res = acc / res
			}

			return res
		})

		this.coefficients = [...c]

		if (n % 2 == 0) {
			c.reverse()
			c.shift()
			this.coefficients.push(...c)
		} else {
			this.coefficients.push(...c.reverse())
		}
	}
}

export interface Data {
	cvs: HTMLCanvasElement
	ctx: CanvasRenderingContext2D
	bezier: Bezier
	segments: number
	duration: number
	drawnText: boolean
}

export const sketch: Sketch<Data> = {
	init(canvas) {
		const bezier = new Bezier()

		canvas.addEventListener('click', (e) => {
			const pos = computePointPos(e, canvas)
			bezier.add(Vector.fromPoint(pos))
		})

		canvas.addEventListener('keypress', (e) => {
			switch (e.key) {
				case ' ':
					bezier.reset()
			}
		})

		const ctx = canvas.getContext('2d')!
		ctx.fillStyle = 'red'
		ctx.strokeStyle = 'black'

		return {
			cvs: canvas,
			ctx,
			bezier,
			segments: 100,
			duration: 2.0,
			drawnText: false,
		}
	},
	draw(data, t) {
		const { cvs, ctx, bezier, segments, duration, drawnText } = data

		if (bezier.control.length === 0) {
			if (drawnText) return

			ctx.save()
			ctx.fillStyle = 'black'

			const style = getComputedStyle(cvs)
			ctx.font = style.font

			const msg = 'Click anywhere to place a point.'
			const metrics = ctx.measureText(msg)
			const x = (cvs.width - metrics.width) / 2
			const y = cvs.height / 2

			ctx.fillText(msg, x, y)
			ctx.restore()

			data.drawnText = true
			return
		}

		ctx.clearRect(0, 0, cvs.width, cvs.height)

		const drawPoint = (p: Point) => {
			ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2.0)
		}

		ctx.save()

		bezier.control.forEach((point, i) => {
			if (i === 0 || i === bezier.control.length - 1) {
				ctx.fillStyle = 'red'
			} else {
				ctx.fillStyle = 'black'
			}

			ctx.beginPath()
			drawPoint(point)
			ctx.fill()
		})

		ctx.restore()

		if (bezier.control.length < 2) {
			return
		}

		ctx.save()
		ctx.strokeStyle = 'grey'

		{
			const p = bezier.control[0]
			ctx.moveTo(p.x, p.y)
		}

		for (let i = 0; i < bezier.control.length; i += 1) {
			const p = bezier.control[i]
			ctx.lineTo(p.x, p.y)
		}

		ctx.stroke()
		ctx.restore()

		const s = ((t / 1000) % duration) / duration

		ctx.save()
		ctx.beginPath()

		{
			const p = bezier.control[0]
			ctx.moveTo(p.x, p.y)
		}

		for (let i = 0; i <= segments; i += 1) {
			const u = i / segments
			if (u > s) break
			const p = bezier.get(u)
			ctx.lineTo(p.x, p.y)
		}

		ctx.stroke()
		ctx.restore()
	},
}

export default sketch
