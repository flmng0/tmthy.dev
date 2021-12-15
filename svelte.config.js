import adapter from '@sveltejs/adapter-static'

import preprocess from 'svelte-preprocess'
import path from 'path'

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
