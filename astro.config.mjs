import { defineConfig } from "astro/config";

import elmPlugin from "vite-plugin-elm";
import Icons from "unplugin-icons/vite";

import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";

import remarkMath from "remark-math";
import rehypeMathjax from "rehype-mathjax";

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), mdx()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeMathjax],
  },
  vite: {
    plugins: [
      elmPlugin(),
      Icons({
        customCollections: {
          custom: {
            astro: `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 128 128">
  <g>
    <path d="M81.504 9.465c.973 1.207 1.469 2.836 2.457 6.09l21.656 71.136a90.079 90.079 0 0 0-25.89-8.765L65.629 30.28a1.833 1.833 0 0 0-3.52.004L48.18 77.902a90.104 90.104 0 0 0-26.003 8.778l21.758-71.14c.996-3.25 1.492-4.876 2.464-6.083a8.023 8.023 0 0 1 3.243-2.398c1.433-.575 3.136-.575 6.535-.575H71.72c3.402 0 5.105 0 6.543.579a7.988 7.988 0 0 1 3.242 2.402Zm0 0"></path>
  </g>
  <path fill="url(#a)"
        d="M47.7 107.1c-5.5-5-7.2-15.7-4.9-23.4 4 4.9 9.6 6.4 15.4 7.3 8.9 1.3 17.6.8 25.9-3.2l2.8-1.7a18 18 0 0 1-7.2 20l-5.5 3.8c-5.6 3.8-7.2 8.2-5 14.7l.2.7a14 14 0 0 1-6.6-5.6 15.8 15.8 0 0 1-2.6-8.6c0-1.5 0-3-.2-4.5-.5-3.7-2.2-5.3-5.5-5.4-3.3-.1-5.9 2-6.6 5.2l-.2.7Z" />

  <defs>
    <linearGradient id="a" x1="64.7" x2="77.4" y1="119.2" y2="77.4" gradientUnits="userSpaceOnUse">
      <stop stop-color="#D83333" />
      <stop offset="1" stop-color="#F041FF" />
    </linearGradient>
  </defs>

  <style>
    [data-theme="light"] g,
    g {
      fill: #000;
    }

    [data-theme="dark"] g {
      fill: #fff;
    }

    @media (prefers-color-scheme: dark) {
      g {
        fill: #FFF;
      }
    }
  </style>
</svg>
            `,
          },
        },
        scale: 1.2,
        defaultClass: "icon",
        compiler: "astro",
      }),
    ],
  },
});
