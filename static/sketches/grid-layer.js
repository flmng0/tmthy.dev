import { run } from './framework.js'

const modulo = (n, d) => ((n % d) + d) % d

class GridLayer {
	constructor(count) {
		// The number of columns.
		this.count = count || 3
	}

	layout(items) {
		const count = this.count
		const columns = Array.from({ length: count }, () => [])
		const heights = new Array(count).fill(0)

		let index = 0

		// For every item, until the stack is empty.
		while (items.length > 0) {
			// The column height before the current one.
			let prevIndex = modulo(index - 1, count)
			let prevHeight = heights[prevIndex]

			// The current column's height.
			let currHeight = heights[index]

			// Keep adding items to the column until it is as tall,
			// or taller than the column before it.
			while (currHeight <= prevHeight && items.length > 0) {
				let item = items.pop()
				let height = item.height
				let value = item.value

				currHeight += height
				columns[index].push(value)
			}
			// Update the height of this column.
			heights[index] = currHeight
			index = (index + 1) % count
		}

		return columns
	}
}

// We are running as a sketch, and not a module.
if (document.querySelector('#sketch-canvas')) {
	const COLUMNS = 4
	const ITEM_COUNT = 15
	const layer = new GridLayer(COLUMNS)

	let columns = null
	const regenerate = () => {
		const items = Array.from({ length: ITEM_COUNT }, () => Math.random()).map((height) => {
			return {
				height: height,
				value: height,
			}
		})

		columns = layer.layout(items)
	}

	function init({ cvs }) {
		regenerate()
		cvs.addEventListener(
			'click',
			() => {
				regenerate()
			},
			true
		)
	}

	function draw({ ctx, cvs }) {
		ctx.fillStyle = 'lightgrey'
		ctx.strokeStyle = 'green'
		ctx.clearRect(0, 0, cvs.width, cvs.height)

		const minHeight = cvs.width / 8
		const maxHeight = minHeight * 2

		for (const [i, column] of columns.entries()) {
			let x = (i * cvs.width) / COLUMNS
			let y = 0

			for (const item of column) {
				const height = minHeight + item * (maxHeight - minHeight)
				let rect = [x, y, cvs.width / COLUMNS, height]

				ctx.fillRect(...rect)
				ctx.strokeRect(...rect)

				y += height
			}
		}
	}

	run(draw, { init })
}
