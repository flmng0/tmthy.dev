import { defineConfig } from "astro/config";

import Icons from "unplugin-icons/vite";

import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [
      Icons({
        scale: 1.2,
        defaultClass: "icon",
        compiler: "astro",
      }),
    ],
  },
  integrations: [svelte(), mdx()],
});
