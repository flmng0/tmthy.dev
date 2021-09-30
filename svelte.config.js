import adapter from '@sveltejs/adapter-static'

import preprocess from 'svelte-preprocess'
import path from 'path'
import fs from 'fs'

const sketchesDir = path.join(process.cwd(), 'src/data/sketches')

function getSketchIDs() {
	const entries = fs.readdirSync(sketchesDir)

	const ids = entries.map((entry) => entry.replace(/\.md$/, ''))

	return ids
}

function getPages() {
	let pages = ['*']

	let sketchPages = getSketchIDs().map((id) => `/sketches/${id}`)
	pages.push(...sketchPages)

	return pages
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess({
		postcss: true,
		globalStyle: true,
		sourceMap: true,
	}),

	kit: {
		adapter: adapter({
			pages: 'out',
		}),
		prerender: {
			enabled: true,
			crawl: true,
			entries: getPages(),
		},
		target: 'body',
		vite: {
			resolve: {
				alias: {
					$components: path.resolve('./src/components'),
					$data: path.resolve('./src/data'),
				},
			},
		},
	},
}

export default config
