import fs from 'fs/promises'

import type { RequestHandler } from './$types'

import { json } from '@sveltejs/kit'

import { importMarkdown } from '$lib/data'
import { sketchesDir } from '$lib/data/sketch'

export const GET: RequestHandler = async () => {
	const mdExt = '.md'
	const allFiles = await fs.readdir(sketchesDir)
	const filtered = allFiles.filter((entry) => entry.endsWith(mdExt))

	const sketchFutures = filtered.map(async (entry) => {
		const slug = entry.slice(0, -mdExt.length)

		const md = await importMarkdown<'sketch'>(slug)

		return [slug, md.attributes]
	})

	const sketches = Object.fromEntries(await Promise.all(sketchFutures))

	return json({
		sketches,
	})
}
