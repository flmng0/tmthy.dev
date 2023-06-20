import { matter } from 'vfile-matter'
import type { Plugin } from 'unified'

export const withMatter = (() => {
    return function (_, file) {
        //@ts-ignore
        matter(file)
    }
}) satisfies Plugin<Array<void>>

export default withMatter
