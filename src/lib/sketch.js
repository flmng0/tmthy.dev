/**
 * @param slug {string} Slug of the sketch
 */
export async function getHtml(slug) {
	return await import(`./data/sketches/${slug}.md`).then((m) => m.default);
}

/**
 * @param slug {string} Slug of the sketch
 */
export async function getSource(slug) {
	return await import(`./data/sketches/${slug}.js?url`).then((m) => m.default);
}
