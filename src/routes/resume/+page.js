import { positions } from '$content'

/** @type {import('./$types').PageLoad} */
export const load = () => {
	const sorted = positions.entries.toSorted((a, b) => {
		if (b.data.end === undefined) return 1
		return b.data.end - a.data.end
	})

	const skills = new Set(sorted.flatMap((pos) => pos.data.skills))

	return { positions: sorted, skills }
}
