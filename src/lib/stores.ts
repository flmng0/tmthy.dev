import { writable, type Writable } from 'svelte/store'

function getInitialTheme(storageKey: string) {
	if (typeof window === 'undefined') {
		return 'dark'
	}

	const stored = window.localStorage?.getItem(storageKey)
	if (stored !== null) return stored

	const match = matchMedia('(prefers-color-scheme: dark)')
	return match.matches === true ? 'dark' : 'light'
}

export const theme = writable(getInitialTheme('theme'))

theme.subscribe((theme) => {
	if (typeof window !== 'undefined') window.localStorage?.setItem('theme', theme)

	if (typeof document !== 'undefined') document.body.setAttribute('data-theme', theme)
})
