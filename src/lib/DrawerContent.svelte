<script lang="ts">
    import type { Snippet } from 'svelte'
    import { closeDrawer } from './Drawer.svelte'

    interface Props {
        title: string
        children?: Snippet
        buttons?: Snippet
    }
    let { title, children, buttons }: Props = $props()
</script>

<div class="drawer-content">
    <header>
        <h2>{title}</h2>
    </header>

    <main>
        {@render children?.()}
    </main>

    <nav>
        <!-- Autofocus is recommended for dialog content -->
        <!-- svelte-ignore a11y_autofocus -->
        <button
            class="close-button"
            onclick={closeDrawer}
            autofocus
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

        <div class="nav-right">
            {@render buttons?.()}
        </div>
    </nav>
</div>

<style>
    .drawer-content {
        width: min(60ch, 100%);

        background: white;
        border-radius: 1em 1em 0 0;
        padding: 0.5em 2em;

        display: flex;
        flex-flow: column;
    }

    .drawer-content h2 {
        font-size: 1.7rem;
        /* TODO: Actually define --font-sans somewhere */
        font-family: var(--font-sans, sans-serif);
        margin-top: 0.5em;
        margin-bottom: 0.2em;
    }

    .drawer-content main {
        padding-inline: 0.4em;
        margin-bottom: 1.3em;
    }

    .drawer-content nav {
        display: flex;
        flex-flow: row;
        justify-content: space-between;
        gap: 0.5em;
        width: 100%;
    }

    .drawer-content .nav-right {
        display: flex;
        flex-flow: row;
        gap: inherit;
    }

    .drawer-content nav :global(button) {
        --background: black;
        --text: white;

        display: flex;
        flex-flow: row;
        align-items: center;

        background: var(--background, black);
        color: var(--text, white);

        border: 0;
        padding: 0.7em 1.2em;
        cursor: pointer;
    }

    .drawer-content nav :global(button > a) {
        color: currentColor;
        text-decoration: none;
    }

    .drawer-content .close-button {
        --background: #eee;
        --text: #000;

        align-self: start;
        gap: 0.2em;
    }
</style>
