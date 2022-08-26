import fs from 'fs/promises'

import type { RequestHandler } from './$types'

import { json } from '@sveltejs/kit'

import { importMarkdown } from '$lib/data'
import { sketchesDir, type SketchDetails } from '$lib/data/sketch'

export const GET: RequestHandler = async () => {
	const mdExt = '.md'
	const allFiles = await fs.readdir(sketchesDir)
	const filtered = allFiles.filter((entry) => entry.endsWith(mdExt))

	const sketchFutures = filtered.map(async (entry) => {
		const slug = entry.slice(0, -mdExt.length)

		const md = await importMarkdown<'sketch'>(slug)

		return [slug, md.attributes] as [string, SketchDetails]
	})

	const resolved = await Promise.all(sketchFutures)
	const entries = resolved.sort((a, b) => {
		const aDate = new Date(a[1].date)
		const bDate = new Date(b[1].date)

		return bDate.valueOf() - aDate.valueOf()
	})
	const sketches = Object.fromEntries(entries)

	return json({
		sketches,
	})
}
