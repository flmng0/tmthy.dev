import type { RequestHandler } from './__types/index.json'

import { importMarkdown, sketchesDir } from '$lib/sketch'
import fs from 'fs/promises'
import path from 'path'

export const get: RequestHandler = async () => {
	const mdExt = '.md'
	const allFiles = await fs.readdir(sketchesDir)
	const filtered = allFiles.filter((entry) => entry.endsWith(mdExt))

	const sketchFutures = filtered.map(async (entry) => {
		const slug = entry.slice(0, -mdExt.length)

		const md = await importMarkdown(slug)

		return {
			slug,
			...md.attributes,
		}
	})

	const sketches = await Promise.all(sketchFutures)

	return {
		body: {
			sketches,
		},
	}
}
