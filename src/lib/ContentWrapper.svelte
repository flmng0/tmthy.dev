<script>
    import appState from './appState.svelte'

    /** @type {{ children: import("svelte").Snippet }} */
    let { children } = $props()
</script>

<div class="content-wrapper" class:ready={appState.ready}>
    {@render children()}
</div>

<style>
    .content-wrapper {
        position: relative;
        inset: 0;

        display: flex;
        flex-direction: column;
        justify-content: center;

        margin-top: calc(100svh - 10em);
        margin-inline: auto;
        padding-inline: 0.5em;
        width: min(66ch, 100%);

        translate: 0 100%;
        transition: 400ms translate ease-out;
    }

    .content-wrapper.ready {
        translate: 0 0;
    }
</style>
