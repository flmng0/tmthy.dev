import path from 'path'
import fs from 'fs/promises'
import { highlighterPromise } from '.'

export async function highlightSketchSource(slug: string): Promise<string> {
    const highlighter = await highlighterPromise

    const base = 'src/lib/sketches'
    const sourcePath = path.join(process.cwd(), base, `${slug}.ts`)

    const content = await fs.readFile(sourcePath)
    const highlighted = highlighter.codeToHtml(String(content), {
        lang: 'typescript',
        theme: 'github-dark',
    })

    return highlighted
}

export async function getBackgroundColor(): Promise<string> {
    return (await highlighterPromise).getBackgroundColor('github-dark')
}
