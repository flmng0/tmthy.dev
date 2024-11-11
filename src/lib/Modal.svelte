<script lang="ts" module>
    import { type Snippet } from 'svelte'
    import { writable } from 'svelte/store'

    type ModalStyle = 'centered' | 'tray'
    type ModalValue = {
        snippet: Snippet
        style: ModalStyle
    }

    const modal = writable<ModalValue | null>(null)

    export function setModal(snippet: Snippet, style?: ModalStyle) {
        modal.set({
            snippet,
            style: style || 'centered',
        })
    }

    export function closeModal() {
        modal.set(null)
    }
</script>

<script lang="ts">
    let dialog = $state<HTMLDialogElement>()

    $effect(() => {
        if ($modal) {
            dialog?.showModal()
        }
    })
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions, a11y_click_events_have_key_events -->
<dialog
    bind:this={dialog}
    onclick={(e) => {
        if (e.target === dialog) dialog.close()
    }}
    onclose={() => ($modal = null)}
    class={$modal?.style}
>
    <div class="inner">
        <!-- This is explicitly stated in the MDN usage notes to be the intended usage -->
        <!-- svelte-ignore a11y_autofocus -->
        <button class="close-button" onclick={() => dialog?.close()} autofocus>
            x
        </button>

        <div>
            {@render $modal?.snippet()}
        </div>
    </div>
</dialog>

<style>
    .inner {
        display: flex;
        flex-flow: column nowrap;
    }

    .close-button {
        align-self: end;
    }

    dialog {
        inset: 0;
        z-index: 1;
        border: none;
        padding: 0;
    }

    dialog::backdrop {
        background-color: rgba(0, 0, 0, 0.3);
    }

    dialog[open] {
        animation: flyIn 0.3s cubic-bezier(0.39, 0.575, 0.565, 1);
    }

    @keyframes flyIn {
        from {
            transform: scale(0.6) translateY(1rem);
        }
        to {
            transform: scale(1) translateY(0);
        }
    }
</style>
