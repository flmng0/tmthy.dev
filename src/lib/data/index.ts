import type { Sketch, SketchDetails } from './sketch'

interface AttributeMap {
	sketch: SketchDetails
}

// Generic type AK stands for *A*ttributeMap *K*ey.
//
// Note that the front-matter is not enforced, it just makes IntelliSense better.
export interface Markdown<AK extends keyof AttributeMap> {
	// Typed frontmatter.
	attributes: AttributeMap[AK]

	// Table of contents.
	toc: { level: string; content: string }[]

	// Raw HTML after compilation, for use in {@html} blocks.
	html: string
}

export async function importMarkdown<K extends keyof AttributeMap>(
	slug: string,
): Promise<Markdown<K>> {
	return await import(`./sketches/${slug}.md`)
}

export async function importSketch(slug: string): Promise<Sketch<unknown>> {
	return (await import(`./sketches/${slug}.ts`)).default
}
