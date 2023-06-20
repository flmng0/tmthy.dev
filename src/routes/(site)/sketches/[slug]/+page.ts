import { importSketch, type SketchModule } from '$lib/sketch'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load = (async ({ params, data }) => {
    const { slug } = params

    try {
        const sketchModule = (await importSketch(slug)) as SketchModule

        return {
            module: sketchModule.default,
            ...data,
        }
    } catch {
        throw error(404, `sketch module for slug '${slug}' not found`)
    }
}) satisfies PageLoad
