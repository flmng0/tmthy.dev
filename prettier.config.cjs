module.exports = {
	useTabs: true,
	singleQuote: true,
	trailingComma: 'all',
	semi: false,
	printWidth: 100,

	importOrder: ['<THIRD_PARTY_MODULES>', '\\./\\$types', '^(@sveltejs|svelte)/(.*)$', '^\\$lib'],
	importOrderSeparation: true,
	importOrderSortSpecifiers: true,
}
