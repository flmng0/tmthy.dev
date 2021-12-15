import { writable } from 'svelte/store'

const themeKey = 'theme'
const initialTheme = () => {
	if (typeof window !== 'undefined') {
		if (window.localStorage) {
			const stored = localStorage.getItem(themeKey)
			if (stored) {
				return stored
			}
		}

		if (window.matchMedia) {
			const match = matchMedia('preferred-color-scheme: dark)')
			return match ? 'dark' : 'light'
		}
	}

	return 'dark'
}

export const theme = writable(initialTheme())

theme.subscribe((theme) => {
	if (typeof window !== 'undefined' && window.localStorage) {
		localStorage.setItem(themeKey, theme)
	}
})
