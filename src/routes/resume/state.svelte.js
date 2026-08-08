export const state = $state({
	highlighted: null,
	/** @type {any | null} */
	secrets: null
})

/**
 * @param {string} token
 */
export async function loadSecrets(token) {
	const params = new URLSearchParams({ token })

	const res = await fetch(`/resume/secrets?${params.toString()}`)
	if (!res.ok) {
		return
	}

	const json = await res.json()
	state.secrets = json
}
