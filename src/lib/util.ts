import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkFrontmatter, { type Root } from 'remark-frontmatter'
import remarkRehype from 'remark-rehype'
import rehypePrism from 'rehype-prism-plus'
import rehypeStringify from 'rehype-stringify'

import fs from 'fs/promises'
import yaml from 'js-yaml'

const parser = unified().use(remarkParse).use(remarkFrontmatter, ['yaml'])

const runner = unified().use(remarkRehype).use(rehypePrism).use(rehypeStringify)

export async function processMarkdown<F extends Record<string, any>>(
	path: string,
): Promise<{ frontmatter: F; html: string }> {
	const file = await fs.readFile(path)
	const tree = parser.parse(file)
	const frontmatter = extractFrontmatter<F>(tree)

	const html = runner.stringify(await runner.run(tree))

	return {
		frontmatter,
		html,
	}
}

export async function getFrontmatter<F extends Record<string, any>>(path: string): Promise<F> {
	const file = await fs.readFile(path)
	const tree = parser.parse(file)

	return extractFrontmatter<F>(tree)
}

export function extractFrontmatter<F extends Record<string, any>>(tree: Root): F {
	if (tree.children.length === 0 || tree.children[0].type !== 'yaml') {
		throw 'Invalid frontmatter'
	}

	const value = tree.children[0].value

	const frontmatter = yaml.load(value) as F
	return frontmatter
}
