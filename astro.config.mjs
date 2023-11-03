import { defineConfig } from "astro/config";

import Icons from "unplugin-icons/vite";

import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [
      Icons({
        customCollections: {
          custom: {
            astro: `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 128 128">
  <g>
    <path
          d="M47.7 107.1c-5.5-5-7.2-15.7-4.9-23.4 4 4.9 9.6 6.4 15.4 7.3 8.9 1.3 17.6.8 25.9-3.2l2.8-1.7a18 18 0 0 1-7.2 20l-5.5 3.8c-5.6 3.8-7.2 8.2-5 14.7l.2.7a14 14 0 0 1-6.6-5.6 15.8 15.8 0 0 1-2.6-8.6c0-1.5 0-3-.2-4.5-.5-3.7-2.2-5.3-5.5-5.4-3.3-.1-5.9 2-6.6 5.2l-.2.7Z" />
    <path
          d="M16 82.4s16.5-8 33-8l12.4-38.3c.5-2 1.8-3.2 3.3-3.2 1.6 0 3 1.3 3.4 3.2l12.4 38.3c19.6 0 33 8 33 8l-28-76c-.8-2.3-2.2-3.7-4-3.7H48c-1.8 0-3.1 1.4-4 3.7l-28 76Z" />
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
  integrations: [svelte(), mdx()],
});
