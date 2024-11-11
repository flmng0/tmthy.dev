/** @type {import("prettier").Config} */
const options = {
  trailingComma: "es5",
  tabWidth: 4,
  semi: false,
  singleQuote: true,
  htmlWhitespaceSensitivity: "ignore",
};

/** @type {import("prettier").Config} */
const plugins = {
  plugins: ["prettier-plugin-astro", "prettier-plugin-svelte"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
    {
      files: "*.svelte",
      options: {
        parser: "svelte",
      },
    },
  ],
};

/** @type {import("prettier").Config} */
export default {
  ...options,
  ...plugins,
};
