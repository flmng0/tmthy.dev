import prism from 'prismjs'
import loadLanguages from 'prismjs/components/index.js'
import { defineConfig } from 'vite'
import * as md from 'vite-plugin-markdown'

import { sveltekit } from '@sveltejs/kit/vite'

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
