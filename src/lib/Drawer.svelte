<script lang="ts" module>
    import { type Snippet } from 'svelte'
    import { get, writable } from 'svelte/store'

    type DrawerStyle = 'drawer' | 'modal'
    type DrawerContent = {
        snippet: Snippet
        style: DrawerStyle
    }

    const content = writable<DrawerContent | null>(null)

    export function setDrawer(snippet: Snippet, style: DrawerStyle = 'drawer') {
        if (snippet === get(content)?.snippet) {
            return
        }
        content.set({ snippet, style })
    }

    export function closeDrawer() {
        content.set(null)
    }
</script>

<script lang="ts">
    import { fly } from 'svelte/transition'

    let dialog = $state<HTMLDialogElement>()

    $effect(() => {
        if ($content !== null) {
            dialog?.show()
        }
    })

    // Doing it this way will only set the display of the dialog to
    // `none` when the animation is complete.
    const maybeClose = () => {
        if ($content === null) {
            dialog?.close()
        }
    }
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions, a11y_click_events_have_key_events -->
<dialog bind:this={dialog} class={$content?.style}>
    {#if $content}
        {#key $content}
            <div
                class="inner"
                transition:fly|global={{ y: 200, duration: 300 }}
                onoutroend={maybeClose}
            >
                {@render $content?.snippet()}
            </div>
        {/key}
    {/if}
</dialog>

<style>
    .inner {
        position: absolute;
        bottom: 0;
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 0 0.5em;
    }

    .inner > :global(*) {
        pointer-events: initial;
    }

    dialog {
        z-index: 1;
        border: none;
        background: none;
        width: 100%;
        height: 100%;
        pointer-events: none;
        padding: 0;
    }
</style>
