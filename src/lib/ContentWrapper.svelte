<script>
    import { fly } from 'svelte/transition'

    /** @type {{ children: import("svelte").Snippet }} */
    let { children } = $props()
</script>

<div class="content-wrapper" in:fly={{ y: 200, duration: 300, opacity: 1 }}>
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
    }
</style>
