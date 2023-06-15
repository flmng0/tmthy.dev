import type z from 'zod'
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
}

export async function getData<K extends keyof Collections>(
    collection: K,
    slug: string
): Promise<CollectionData<K>> {
    const schema = collections[collection]

    console.log('before import', slug);
    const mdModule = (await import(`./${collection}/${slug}.md`)) as MarkdownData<K>
    console.log('after import', mdModule.html);

    const properties = (await schema.parseAsync(mdModule.attributes)) as CollectionProperties<K>
    const body = mdModule.html

    return {
        properties,
        body,
        slug,
    }
    // schema.parseAsync()
}

export function baseDir<K extends keyof Collections>(
    collection: K
) {
    return `src/lib/data/${collection}`
}
