import { defineConfig } from 'vite'

import { sveltekit } from '@sveltejs/kit/vite'

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

export default defineConfig({
	plugins: [sveltekit(), md.plugin(mdOptions)],
})
