import type z from 'zod'
import { collections } from './schema'
import path from 'path'
import { compile } from './markdown'

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
}

export async function getAllData<K extends keyof Collections>(
    collection: K
): Promise<CollectionData<K>[]> {
    return []
}

export async function getData<K extends keyof Collections>(
    collection: K,
    slug: string
): Promise<Partial<CollectionData<K>>> {
    const schema = collections[collection]

    const base = baseDir(collection)
    const sourcePath = path.join(process.cwd(), base, `${slug}.md`)

    const compiled = await compile(sourcePath)

    // const properties = (await schema.parseAsync(mdModule.attributes)) as CollectionProperties<K>
    // const body = mdModule.html

    return {
        slug,
        body: compiled,
    }
}

export function baseDir<K extends keyof Collections>(collection: K) {
    return `src/data/${collection}`
}
