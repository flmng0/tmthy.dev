import type { RequestHandler } from './__types/[slug].json'

import { importMarkdown, sketchesDir } from '$lib/sketch'
import prism from 'prismjs'
import loadLanguages from 'prismjs/components/index.js'
import fs from 'fs/promises'

loadLanguages('typescript')

export const get: RequestHandler = async ({ params }) => {
	const { slug } = params

	const md = await importMarkdown(slug)

	const sourcePath = `${sketchesDir}/${slug}.ts`

	const raw = (await fs.readFile(sourcePath)).toString()
	const source = prism.highlight(raw, prism.languages['ts'], 'ts')

	return {
		body: {
			sourcePath,
			markdown: md.html,
			source,
		},
	}
}
