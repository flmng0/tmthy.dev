import type { RequestHandler } from './__types/index.json'

import { sketchesDir } from '$lib/data/sketch'
import { importMarkdown } from '$lib/data'
import fs from 'fs/promises'

export const GET: RequestHandler = async () => {
	const mdExt = '.md'
	const allFiles = await fs.readdir(sketchesDir)
	const filtered = allFiles.filter((entry) => entry.endsWith(mdExt))

	const sketchFutures = filtered.map(async (entry) => {
		const slug = entry.slice(0, -mdExt.length)

		const md = await importMarkdown('sketch', slug)

		return [slug, md.attributes]
	})

	const sketches = Object.fromEntries(await Promise.all(sketchFutures))

	return {
		body: {
			sketches,
		},
	}
}
