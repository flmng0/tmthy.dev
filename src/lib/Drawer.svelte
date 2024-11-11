<script lang="ts" module>
    import { type Snippet } from 'svelte'
    import { writable } from 'svelte/store'
    import { fly } from 'svelte/transition'

    type DrawerStyle = 'drawer' | 'modal'
    type DrawerContent = {
        snippet: Snippet
        style: DrawerStyle
    }

    const content = writable<DrawerContent | null>(null)

    export function setDrawer(snippet: Snippet, style: DrawerStyle = 'drawer') {
        content.set({ snippet, style })
    }

    export function closeDrawer() {
        content.set(null)
    }
</script>

<script lang="ts">
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

<!-- TODO: Continue styling of buttons... maybe remove close button and replace with CTAs? -->

<!-- svelte-ignore a11y_no_noninteractive_element_interactions, a11y_click_events_have_key_events -->
<dialog bind:this={dialog} class={$content?.style}>
    {#if $content}
        {#key $content}
            <div
                class="inner"
                transition:fly|global={{ y: 200, duration: 300 }}
                onoutroend={maybeClose}
            >
                <div>
                    {@render $content?.snippet()}
                </div>

                <!-- This is explicitly stated in the MDN usage notes to be the intended usage -->
                <!-- svelte-ignore a11y_autofocus -->
                <button
                    class="close-button"
                    onclick={() => ($content = null)}
                    autofocus={$content !== null}
                    aria-label="Close"
                >
                    <span>Close</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="currentColor"
                            d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
                        />
                    </svg>
                </button>
            </div>
        {/key}
    {/if}
</dialog>

<style>
    .inner {
        position: absolute;
        bottom: 0;
        left: 50%;
        translate: -50%;

        width: min(60ch, 100%);
        background: white;
        border-radius: 1em 1em 0 0;
        padding: 0.5em 2em;

        display: flex;
        flex-flow: column;

        pointer-events: all;
    }

    .close-button {
        all: unset;
        align-self: end;
        font-size: 1em;
        cursor: pointer;
        background: black;
        color: white;
        display: flex;
        align-items: center;
        gap: 0.5em;
        padding: 0.5em 0.7em;
        border-radius: 0.5em;
    }

    dialog {
        z-index: 1;
        border: none;
        background: none;
        padding: 0;
        width: 100%;
        height: 100%;
        padding: 0.5em;
        pointer-events: none;
    }
</style>
