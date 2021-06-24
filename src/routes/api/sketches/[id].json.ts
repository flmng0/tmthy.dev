import marked from 'marked'
import matter from 'gray-matter'
import path from 'path'
import fs from 'fs'

import type { RequestHandler } from '@sveltejs/kit'

const sketchesDir = path.join(process.cwd(), 'src/data/sketches')

export const get: RequestHandler = async ({ params }) => {
	const { id } = params

	const sketchPath = path.join(sketchesDir, `${id}.md`)

	try {
		const fileContent = await fs.promises.readFile(sketchPath)

		const matterResult = matter(fileContent)
		const contentHtml = marked(matterResult.content)

		return {
			body: {
				...matterResult.data,
				contentHtml,
			},
		}
	} catch (e) {
		return {
			status: 404,
		}
	}
}
