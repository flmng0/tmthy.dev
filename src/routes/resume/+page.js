import { cv } from '$content'

/** @type {import('./$types').PageLoad} */
export const load = () => {
	const positions = cv.entries.toSorted((a, b) => {
		if (b.data.end === undefined) return 1
		return b.data.end - a.data.end
	})

	const skills = new Set(positions.flatMap((pos) => pos.data.skills))

	return { positions, skills }
}
