import { marked } from "marked";
import matter from "gray-matter";
import path from "path";
import fs from "fs";

import type { RequestHandler } from "@sveltejs/kit";

const sketchDir = path.join(process.cwd(), "src/data/sketches");

// TODO:
//  Currently, this loads the entire file, which is okay, but so does the index route.
//
//  Maybe find a way that the /sketches path can reference the description and id from
//   an individual sketch (/sketches/{id}).
export const get: RequestHandler = async ({ params }) => {
	const { id } = params;

	const sketchPath = path.join(sketchDir, `${id}.md`);

	try {
		const content = await fs.promises.readFile(sketchPath);

		const matterResult = matter(content);
		const html = marked(matterResult.content);

		return {
			body: {
				...matterResult.data,
				html,
			},
		};
	} catch (e) {
		return {
			status: 404,
		};
	}
};
