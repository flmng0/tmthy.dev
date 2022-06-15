import type { RequestHandler } from './__types/[slug].json'

import { sketchesDir, type SketchFrontmatter } from '$lib/sketch'
import { processMarkdown } from '$lib/util'
import prism from 'prismjs'
import loadLanguages from 'prismjs/components/index.js'
import fs from 'fs/promises'

loadLanguages('typescript')

export const get: RequestHandler = async ({ params }) => {
	const { slug } = params

	const mdPath = `${sketchesDir}/${slug}.md`

	const data = await processMarkdown<SketchFrontmatter>(mdPath)
	const sourcePath = `${sketchesDir}/${slug}.ts`

	const markdown = data.html

	const raw = (await fs.readFile(sourcePath)).toString()
	const source = prism.highlight(raw, prism.languages['ts'], 'ts')

	return {
		body: {
			sourcePath,
			markdown,
			source,
		},
	}
}
