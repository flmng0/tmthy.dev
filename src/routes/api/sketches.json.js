import matter from 'gray-matter'
import path from 'path'
import fs from 'fs'

import { sketchesSub } from '$lib/consts'

const sketchesDir = path.join(process.cwd(), sketchesSub)

export async function get({ params }) {
	// Maybe use params for a count at some point.

	try {
		const entries = await fs.promises.readdir(sketchesDir)

		const sketches = entries.map((entry) => {
			const id = entry.replace(/\.md$/, '')

			const fileContent = fs.readFileSync(path.join(sketchesDir, entry))
			const matterResult = matter(fileContent)

			return {
				id,
				...matterResult.data,
			}
		})

		return {
			body: {
				sketches,
			},
		}
	} catch (e) {
		return {
			status: 500,
		}
	}
}
