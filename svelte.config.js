import adapter from '@sveltejs/adapter-static'

import preprocess from 'svelte-preprocess'
import path from 'path'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),

	kit: {
		adapter: adapter({
			pages: 'out',
		}),
		target: 'body',
		vite: {
			resolve: {
				alias: {
					$components: path.resolve('./src/components'),
				},
			},
		},
	},
}

export default config
