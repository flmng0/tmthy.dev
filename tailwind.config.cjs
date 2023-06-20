/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config}*/
module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        colors: {
            flamingo: {
                DEFAULT: '#262226',
                50: '#E8E6E8',
                100: '#DDDADE',
                200: '#C8C1C8',
                300: '#B2A9B2',
                400: '#9C919D',
                500: '#867987',
                600: '#6E636F',
                700: '#564D56',
                800: '#3E383E',
                900: '#262226',
                950: '#171517',
            },
            avocado: '#326312',
            fuchsia: '#F188D7',
            white: '#E8E6E8',
        },
        extend: {
            typography: ({ theme }) => ({
                DEFAULT: {
                    css: {
                        '--tw-prose-body': theme('colors.flamingo[200]'),
                        '--tw-prose-headings': theme('colors.flamingo[50]'),
                        '--tw-prose-lead': theme('colors.flamingo[300]'),
                        '--tw-prose-links': theme('colors.fuchsia'),
                        '--tw-prose-bold': theme('colors.flamingo[50]'),
                        '--tw-prose-counters': theme('colors.flamingo[400]'),
                        '--tw-prose-bullets': theme('colors.flamingo[600]'),
                        '--tw-prose-hr': theme('colors.flamingo[700]'),
                        '--tw-prose-quotes': theme('colors.flamingo[100]'),
                        '--tw-prose-quote-borders': theme('colors.flamingo[700]'),
                        '--tw-prose-captions': theme('colors.flamingo[400]'),
                        '--tw-prose-code': theme('colors.flamingo[50]'),
                        '--tw-prose-pre-code': theme('colors.flamingo[300]'),
                        '--tw-prose-pre-bg': 'rgb(0 0 0 / 50%)',
                        '--tw-prose-th-borders': theme('colors.flamingo[600]'),
                        '--tw-prose-td-borders': theme('colors.flamingo[700]'),
                    },
                },
            }),
        },
    },
    plugins: [require('@tailwindcss/typography')],
}
