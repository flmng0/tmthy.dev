<script module>
    export const breakpoints = {
        mobile: '(min-width: 480px)',
        tablet: '(min-width: 768px)',
        desktop: '(min-width: 1024px)',
    }

    /** @typedef {keyof typeof breakpoints} Breakpoint */

    /** @type {Breakpoint[]} */
    const order = ['desktop', 'tablet', 'mobile']

    /** @typedef {{ matches: boolean }} MediaQuery */

    /**
     * @param {Breakpoint} key
     */
    const mediaQuery = (key) => {
        if (typeof window === 'undefined') {
            return { matches: false }
        }

        const mm = window.matchMedia(breakpoints[key])

        let matches = $state(mm.matches)

        mm.addEventListener('change', (e) => {
            matches = e.matches
        })

        return {
            get matches() {
                return matches
            },
        }
    }

    /** @type {Record<Breakpoint, MediaQuery>} */
    export const queries = {
        mobile: mediaQuery('mobile'),
        tablet: mediaQuery('tablet'),
        desktop: mediaQuery('desktop'),
    }
</script>

<script>
    /**
     * @typedef {{ [B in Breakpoint]?: import("svelte").Snippet }} Snippets
     */

    /**
     * @typedef {Object} BaseProps
     * @property {import("svelte").Snippet} children
     */

    /** @type {BaseProps & Snippets} */
    let { children, ...snippets } = $props()

    /**
     * @param {Snippets} snippets
     */
    const getHighest = (snippets) => {
        for (const breakpoint of order) {
            const snippet = snippets[breakpoint]

            if (snippet && queries[breakpoint].matches) {
                return snippet
            }
        }
    }

    const activeSnippet = $derived(getHighest(snippets))
</script>

{#if activeSnippet}
    {@render activeSnippet?.()}
{:else}
    {@render children()}
{/if}
