import { getAllData } from '$lib/server/data'
import type { LayoutServerLoad } from './$types'

export const prerender = true

export const load = (async () => {
    return {
        sketches: await getAllData('sketches'),
    }
}) satisfies LayoutServerLoad
