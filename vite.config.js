import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import * as md from 'vite-plugin-markdown'

export default defineConfig({
    plugins: [md.plugin({ mode: md.Mode.HTML  }), sveltekit()],
})
