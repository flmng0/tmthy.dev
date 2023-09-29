/**
 * @param {string} slug Slug of the sketch
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
 */
export async function getSource(slug) {
	return await import(`./data/sketches/${slug}.js?url`).then((m) => m.default);
}

/**
 * @template [T=any]
 * @typedef {Object} Sketch
 *
 * @property {(cvs: HTMLCanvasElement) => T | null} init
 * @property {(state: T, t: number) => void} draw
 *
 */
