import { readdir } from 'fs/promises';
import { join } from 'path';

/** @type {import("./$types").PageServerLoad} */
export async function load() {
	const path = join('src', 'lib', 'data', 'sketches');
	const children = await readdir(path);

	const slugs = children
		.filter((entry) => entry.endsWith('.md'))
		.map((entry) => entry.substring(0, entry.length - '.md'.length));

	return { slugs };
}
