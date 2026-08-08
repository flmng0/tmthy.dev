import { env } from '$env/dynamic/private'
import { error, json } from '@sveltejs/kit'

/**
 * @param {string | null} token
 */
async function validateToken(token) {
	try {
		const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				secret: env.TURNSTILE_SECRET_KEY,
				response: token
			})
		})

		const result = await response.json()
		return result.success
	} catch (e) {
		return false
	}
}

/** @type {import("./$types").RequestHandler} */
export const GET = ({ url }) => {
	// Verify with turnstile, decode Base64 JSON Cloudflare secret.
	//
	// Brief:
	// 1. Wait for client-side token via Turnstile widget
	// 2. Call this endpoint with Turnstile token
	// 3. Verify Turnstile token with Cloudflare endpoint: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
	// 4. Once verified, decode secret value and return to frontend.

	const token = url.searchParams.get('token')
	const valid = validateToken(token)

	if (!valid) {
		error(403, 'Turnstile challenge failed, are you a robot?')
	}

	const buffer = Buffer.from(env.RESUME_SECRETS, 'base64')
	const text = buffer.toString('utf8')

	return json(JSON.parse(text))
}
