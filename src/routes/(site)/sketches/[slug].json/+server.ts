import fs from 'fs/promises'
import prism from 'prismjs'
import loadLanguages from 'prismjs/components/index.js'

import type { RequestHandler } from './$types'

import { json } from '@sveltejs/kit'

import { importMarkdown } from '$lib/data'
import { sketchesDir } from '$lib/data/sketch'

loadLanguages('typescript')

export const GET: RequestHandler = async ({ params }) => {
	const { slug } = params

	const md = await importMarkdown<'sketch'>(slug)

	const sourcePath = `${sketchesDir}/${slug}.ts`

	const raw = (await fs.readFile(sourcePath)).toString()
	const source = prism.highlight(raw, prism.languages['ts'], 'ts')

	return json({
		sourcePath,
		source,
		...md,
	})
}
