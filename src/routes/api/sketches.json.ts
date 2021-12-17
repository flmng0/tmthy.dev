import matter from 'gray-matter'
import path from 'path'
import fs from 'fs'

import type { RequestHandler } from '@sveltejs/kit'

const sketchDir = path.join(process.cwd(), 'src/data/sketches')

export const get: RequestHandler = async ({ params }) => {
	try {
		const ext = '.md'
		const entries = (await fs.promises.readdir(sketchDir)).filter((e) => e.endsWith(ext))

		const sketches = entries.map((entry) => {
			const id = entry.substring(0, entry.length - ext.length)

			const fileContent = fs.readFileSync(path.join(sketchDir, entry))
			const matterResult = matter(fileContent)

			return {
				id,
				...matterResult.data,
			}
		})

		return {
			body: {
				status: 200,
				sketches,
			},
		}
	} catch (e) {
		return {
			status: 500,
		}
	}
}
