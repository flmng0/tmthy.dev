<script>
    import '$lib/styles.css'
    import { onNavigate } from '$app/navigation'

    import appState from '$lib/appState.svelte'
    import Hero from '$lib/hero/Hero.svelte'
    import Header from './Header.svelte'

    let { children } = $props()

    onNavigate((navigation) => {
        if (!document.startViewTransition) return

        return new Promise((resolve) => {
            document.startViewTransition(async () => {
                resolve()
                await navigation.complete
            })
        })
    })
</script>

{#if appState.ready}
    <Header />
{/if}

<Hero title={appState.title} />

<main>
    {@render children()}
</main>

<style>
    main {
        position: absolute;
        background: white;
    }
</style>
