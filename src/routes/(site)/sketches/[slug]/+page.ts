import type { PageLoad } from './$types'

import { error } from '@sveltejs/kit'

export const load: PageLoad = async ({ params, fetch }) => {
	const { slug } = params

	const response = await fetch(`/sketches/${slug}.json`)
	if (!response.ok) {
		throw error(response.status, `Failed to load sketch \`${slug}\`}`)
	}

	const data = await response.json()

	return {
		slug,
		...data,
	} //= await response.json()
}
