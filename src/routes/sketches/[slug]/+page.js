import { getWriteup, getSource } from '$lib/sketch';

/** @type {import("./$types").PageLoad} */
export async function load({ params }) {
	const slug = params.slug;
	const writeup = getWriteup(slug);
	const scriptSrc = getSource(slug);

	return {
		slug,
		writeup,
		scriptSrc
	};
}
