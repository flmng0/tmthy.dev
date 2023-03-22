import { defineConfig } from 'astro/config'

import cloudflare from '@astrojs/cloudflare'

import tailwind from '@astrojs/tailwind'
import solidJs from '@astrojs/solid-js'

import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

export default defineConfig({
    output: 'server',
    adapter: cloudflare(),

    integrations: [tailwind(), solidJs()],
    markdown: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
    },
})
