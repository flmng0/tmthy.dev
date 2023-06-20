import type { Toc } from '@stefanprobst/remark-extract-toc'
import fs from 'fs/promises'
import path from 'path'
import type z from 'zod'
import { compile } from './markdown'
import { collections } from './schema'

export type Collections = typeof collections
export type CollectionProperties<K extends keyof Collections> = z.infer<Collections[K]>

export interface MarkdownData<K extends keyof Collections> {
    attributes: CollectionProperties<K>
    html: string
}

export interface CollectionData<K extends keyof Collections> {
    properties: CollectionProperties<K>
    body: string
    slug: string
    toc: Toc
}

export async function getAllData<K extends keyof Collections>(
    collection: K
): Promise<CollectionData<K>[]> {
    const entries = await fs.readdir(baseDir(collection))

    const mdFiles = entries.filter((entry) => entry.endsWith('.md'))

    const futures = mdFiles.map(async (entry) => {
        const slug = entry.slice(0, -'.md'.length)
        const data = await getData(collection, slug)

        return data
    })

    return await Promise.all(futures)
}

export async function getData<K extends keyof Collections>(
    collection: K,
    slug: string
): Promise<CollectionData<K>> {
    const schema = collections[collection]

    const base = baseDir(collection)
    const sourcePath = path.join(process.cwd(), base, `${slug}.md`)

    const compiled = await compile(sourcePath)

    const properties = await schema.parseAsync(compiled.data)
    const toc = compiled.toc

    const body = compiled.body

    return {
        slug,
        properties,
        body,
        toc,
    }
}

export function baseDir<K extends keyof Collections>(collection: K) {
    return `src/data/${collection}`
}
