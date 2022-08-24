import type { SketchDetails } from '$lib/data/sketch'
import { error } from '@sveltejs/kit'

import type { PageLoad } from './$types'

export const load: PageLoad = async ({ fetch }) => {
	const response = await fetch(`/sketches.json`)
	if (!response.ok) {
		throw error(response.status, 'Failed to load sketches')
	}

	return await response.json()
}
