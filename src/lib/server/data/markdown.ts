import rehypeShiki from '@leafac/rehype-shiki'
import withToC, { type Toc } from '@stefanprobst/remark-extract-toc'
import rehypeKaTeX from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import withSlugs from 'remark-slug'
import remarkStringify from 'remark-stringify'
import { unified, type Processor } from 'unified'
import withMatter from './matter'

import shiki from 'shiki'

import fs from 'fs/promises'

let parser: Processor

async function getParser() {
    const highlighter = await shiki.getHighlighter({
        theme: 'github-dark',
    })

    return unified()
        .use(remarkParse)
        .use(remarkMath)
        .use(remarkStringify)
        .use(remarkFrontmatter, ['yaml'])
        .use(withMatter)
        .use(withSlugs)
        .use(withToC)
        .use(remarkRehype)
        .use(rehypeShiki, {
            highlighter,
        })
        .use(rehypeKaTeX)
        .use(rehypeStringify)
}

export interface CompiledMarkdown {
    data: any
    body: string
    toc: Toc
}

export async function compile(path: string): Promise<CompiledMarkdown> {
    if (parser === undefined) {
        parser = await getParser()
    }

    const file = await fs.readFile(path)
    const result = await parser.process(file)

    return {
        data: result.data.matter,
        toc: result.data.toc || [],
        body: String(result),
    }
}
