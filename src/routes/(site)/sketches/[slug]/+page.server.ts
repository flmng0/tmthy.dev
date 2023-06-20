import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async ({ params, parent }) => {
    const parentData = await parent()
    const { slug } = params

    const sketch = parentData.sketches.find((sketch) => sketch.slug === slug)

    if (sketch === undefined) {
        throw error(404, 'sketch not found with slug ' + slug)
    }

    return {
        sketch,
    }
}) satisfies PageServerLoad
