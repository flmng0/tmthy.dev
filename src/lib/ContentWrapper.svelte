<script>
    import { fly } from 'svelte/transition'

    /**
     * @typedef {import("svelte/elements").SvelteHTMLElements['main']} MainProps
     */

    /**
     * @typedef {Object} BaseProps
     * @property {import("svelte").Snippet} children
     */

    /** @typedef {MainProps & BaseProps} Props */

    /** @type {Props} */
    let { children, ...rest } = $props()

    let allowScroll = $state(false)

    $effect(() => {
        if (typeof document === 'undefined') {
            return
        }

        const overflow = allowScroll ? 'initial' : 'hidden'
        document.body.style.overflow = overflow
    })
</script>

<div
    {...rest}
    class="content-wrapper"
    in:fly={{ y: 200, duration: 300, opacity: 1 }}
    ontransitionstart={() => (allowScroll = false)}
    ontransitionend={() => (allowScroll = true)}
>
    {@render children()}
</div>

<style>
    .content-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
    }
</style>
