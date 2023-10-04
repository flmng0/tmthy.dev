/**
 * @param {string} slug Slug of the sketch
 *
 * @returns The content and metadata of the given sketch's writeup
 */
export async function getWriteup(slug) {
	const mod = await import(`./data/sketches/${slug}.md`);

	return {
		component: mod.default,
		metadata: mod.metadata
	};
}

/**
 * @param {string} slug Slug of the sketch
 *
 * @returns {Promise<string>} Source code of the sketch
 */
export async function getSource(slug) {
	return await import(`./data/sketches/${slug}.js?raw`).then((m) => m.default);
}

/**
 * @param {string} slug Slug of the sketch
 *
 * @returns {Promise<Sketch<unknown>>} The resulting sketch object
 */
export function importSketch(slug) {
	return import(`./data/sketches/${slug}.js`).then((m) => m.default);
}

/**
 * @template [T=any]
 * @typedef {Object} Sketch
 *
 * @property {(cvs: HTMLCanvasElement) => T | null} init
 * @property {(state: T, t: number) => void} draw
 *
 */
