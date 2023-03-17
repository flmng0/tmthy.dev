import { Vector } from './math'
import type { Sketch } from './types'

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
    controls: Vector[]
    coefficients: number[]

    constructor() {
        this.controls = []
        this.coefficients = []
    }

    add(control: Vector) {
        this.controls.push(control)
        this.calculateCoefficients()
    }

    reset() {
        this.controls = []
        this.coefficients = []
    }

    get(t: number) {
        const n = this.controls.length

        const getFactor = (i: number) =>
            this.coefficients[i] * Math.pow(1 - t, n - 1 - i) * Math.pow(t, i)

        return this.controls.reduce((acc, point, idx) => {
            const factor = getFactor(idx)
            const v = Vector.fromPoint(point).mul(factor)
            return acc.add(v)
        }, Vector.zero())
    }

    calculateCoefficients() {
        const n = this.controls.length - 1

        if (n - 1 < knownCoefficients.length) {
            this.coefficients = knownCoefficients[n - 1]
            return
        }

        const c = [1]

        for (let k = 1; k <= Math.floor(n / 2); k += 1) {
            const last = c[c.length - 1]
            const next = (n + 1 - k) / k

            c.push(last * next)
        }

        this.coefficients = [...c]
        c.reverse()
        if (n % 2 === 0) {
            c.shift()
        }
        this.coefficients.push(...c)
    }
}

const bezier = new Bezier()
const segments = 100

const sketch: Sketch = {
    type: '2d',

    init(canvas) {
        canvas.addEventListener('click', (e) => {
            // TODO: Fix it for when client width != canvas width
            const control = new Vector(e.offsetX, e.offsetY)
            bezier.add(control)
        })

        canvas.addEventListener('keydown', (e) => {
            e.preventDefault()
            if (e.key === ' ') {
                bezier.reset()
            }
        })
    },

    draw(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.fillStyle = 'black'

        const drawPoint = (p: { x: number; y: number }, r?: number) => {
            ctx.beginPath()
            ctx.arc(p.x, p.y, r ?? 2.5, 0, Math.PI * 2)
            ctx.fill()
        }

        // Draw the control points.
        for (const point of bezier.controls) {
            drawPoint(point)
        }

        if (bezier.controls.length < 2) return

        // Draw the lines connecting the control points
        ctx.strokeStyle = 'black'
        ctx.beginPath()
        const start = bezier.controls[0]
        ctx.moveTo(start.x, start.y)

        for (const point of bezier.controls) {
            ctx.lineTo(point.x, point.y)
        }

        ctx.stroke()

        // Draw the curve
        ctx.resetTransform()
        ctx.beginPath()

        ctx.strokeStyle = 'red'
        ctx.moveTo(start.x, start.y)

        for (let i = 1; i <= segments; i += 1) {
            const t = i / segments
            const point = bezier.get(t)

            ctx.lineTo(point.x, point.y)
        }
        ctx.stroke()
    },
}

export default sketch
