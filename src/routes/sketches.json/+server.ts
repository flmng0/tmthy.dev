import type { RequestHandler } from './$types'

import { sketchesDir } from '$lib/data/sketch'
import { importMarkdown } from '$lib/data'
import fs from 'fs/promises'
import { json } from '@sveltejs/kit'

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

	return json({
		sketches,
	})
}
