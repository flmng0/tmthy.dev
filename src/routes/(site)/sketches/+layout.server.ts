import fs from 'fs/promises'
import { baseDir, getData } from '$lib/server/data'
import type { LayoutServerLoad } from './$types';

export const prerender = true;

export const load = (async () => {
    const entries = await fs.readdir(baseDir('sketches'))

    const mdFiles = entries.filter((entry) => entry.endsWith('.md'))

    const sketchFutures = mdFiles.map(async (entry) => {
        const slug = entry.slice(0, -'.md'.length)

        const data = await getData('sketches', slug)

        return data
    })

    return { 
        sketches: await Promise.all(sketchFutures)
    }
}) satisfies LayoutServerLoad
