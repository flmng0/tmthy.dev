import adapter from '@sveltejs/adapter-static'
import preprocess from 'svelte-preprocess'

import autoprefixer from 'autoprefixer'
import * as md from 'vite-plugin-markdown'
import loadLanguages from 'prismjs/components/index.js'
import prism from 'prismjs'

/** @type {md.PluginOptions} */
const mdOptions = {
	mode: [md.Mode.HTML, md.Mode.TOC],
	markdownIt: {
		highlight: (str, lang) => {
			if (!(lang in prism.languages)) {
				loadLanguages(lang)
			}

			const out = prism.highlight(str, prism.languages[lang], lang)
			return `<pre class="highlight"><code>${out}</code></pre>`
		},
	},
}

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
		vite: {
			plugins: [md.plugin(mdOptions)],
		},
	},
}

export default config
