module.exports = {
    tabWidth: 4,
    singleQuote: true,
    semi: false,
    trailingComma: 'es5',
    printWidth: 100,
    htmlWhitespaceSensitivity: 'css',
    plugins: [
        require.resolve('prettier-plugin-tailwindcss'),
        require.resolve('prettier-plugin-astro'),
    ],
    pluginSearchDirs: ['.'],
    overrides: [{ files: '*.astro', options: { parser: 'astro' } }],
}
