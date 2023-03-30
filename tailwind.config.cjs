const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        colors: {
            white: colors.white,
            black: "#252224",
            gray: colors.gray,
            pink: "#FFB3DF",
            green: "#53C655"
        },
        extend: {},
    },
    plugins: [require('@tailwindcss/typography')],
}
