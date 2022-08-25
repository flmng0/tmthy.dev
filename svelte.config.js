import autoprefixer from 'autoprefixer'
import preprocess from 'svelte-preprocess'

import adapter from '@sveltejs/adapter-static'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess({
		postcss: {
			plugins: [autoprefixer],
		},
	}),

	kit: {
		adapter: adapter(),
		prerender: {
			default: true,
		},
	},
}

export default config
