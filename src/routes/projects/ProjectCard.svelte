<script>
    import appState from '$lib/appState.svelte'
    import { onMount } from 'svelte'

    /** @type {import("./ProjectCard").Props} */
    let { key, children, title, actions, object, position } = $props()

    /** @type {HTMLElement | undefined} */
    let trigger = $state()

    onMount(() => {
        if (!trigger) return

        const scrollTrigger = {
            key,
            trigger,
            target: { ...position, y: 0 },
        }
        object && appState.objects.set(key, object)

        appState.scrollTriggers.push(scrollTrigger)

        return () => {
            object && appState.objects.delete(key)

            const idx = appState.scrollTriggers.findIndex((i) => i.key == key)
            if (idx !== -1) {
                appState.scrollTriggers.splice(idx, 1)
            }
        }
    })
</script>

<article class="project-card glass" bind:this={trigger}>
    <h2>
        {@render title()}
    </h2>

    {@render children()}

    {#if actions}
        <nav>
            {@render actions?.()}
        </nav>
    {/if}
</article>

<style>
    article {
        padding: 1.2em 1.8em;
        border-width: thin;
        color: hsl(0 0 25% / 0.9);
        line-height: 2em;
        border-radius: 0.5em;
    }

    article > h2 {
        color: var(--color-text);
    }

    article > nav {
        margin-top: 2em;
        display: flex;
        flex-flow: row wrap;
        justify-content: end;
        gap: 1em;
    }
</style>
