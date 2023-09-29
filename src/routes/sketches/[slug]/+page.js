import { getHtml, getSource } from '$lib/sketch';

/** @type {import("./$types").PageLoad} */
export async function load({ params }) {
	const content = getHtml(params.slug);
	const scriptSrc = getSource(params.slug);

	return {
		content,
		scriptSrc
	};
}
