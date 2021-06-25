export function shuffle<T>(array: Array<T>): Array<T> {
	const copy = Array.from(array)

	for (let i = copy.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1))

		const temp = copy[i]
		copy[i] = copy[j]
		copy[j] = temp
	}

	return copy
}
