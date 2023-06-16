import { unified, type Processor } from 'unified'
import remarkParse from 'remark-parse'
import remarkToC from 'remark-toc'
import remarkMath from 'remark-math'
import remarkStringify from 'remark-stringify'
import remarkFrontmatter from 'remark-frontmatter'
import remarkRehype from 'remark-rehype'
import rehypeShiki from '@leafac/rehype-shiki'
import rehypeKaTeX from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'

import shiki from 'shiki'

import fs from 'fs/promises'

let parser: Processor

async function getParser() {
    const highlighter = await shiki.getHighlighter({
        theme: 'monokai',
    })

    return unified()
        .use(remarkParse)
        .use(remarkToC)
        .use(remarkMath)
        .use(remarkStringify)
        .use(remarkFrontmatter, ['yaml'])
        .use(remarkRehype)
        .use(rehypeShiki, {
            highlighter,
        })
        .use(rehypeKaTeX)
        .use(rehypeStringify)
}

export async function compile(path: string) {
    if (parser === undefined) {
        parser = await getParser()
    }

    const file = await fs.readFile(path)
    const result = await parser.process(file)

    console.debug(result)

    return String(result)
}
