import { onMount } from 'svelte'

import { sineIn } from 'svelte/easing'

export function canvasToClientSize(cvs: HTMLCanvasElement) {
	const resize = () => {
		cvs.width = cvs.clientWidth
		cvs.height = cvs.clientHeight
	}

	resize()

	window.addEventListener('resize', () => {
		resize()
	})
}

export function makeHorizontalDelay(
	getDuration?: (totalDuration: number) => void,
): (elem: HTMLElement) => void {
	const delayScale = 400
	let delayQueue: HTMLElement[] = []

	const inner = (elem: HTMLElement) => {
		const rect = elem.getBoundingClientRect()

		// Pre-sorting
		const i = delayQueue.findIndex((item) => item.getBoundingClientRect().left > rect.left)
		if (i === -1) {
			delayQueue = [...delayQueue, elem]
		} else {
			delayQueue = [...delayQueue.slice(0, i), elem, ...delayQueue.slice(i)]
		}
	}

	onMount(() => {
		const easing = sineIn
		const delay = (t: number) => easing(t) * delayScale

		delayQueue.forEach((elem, i) => {
			const t = i / delayQueue.length

			elem.style.setProperty('--delay', delay(t) + 'ms')
		})

		const totalDuration = delay(delayQueue.length)
		getDuration?.(totalDuration)
	})

	return inner
}
