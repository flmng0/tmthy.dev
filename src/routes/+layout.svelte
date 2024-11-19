<script>
    import '$lib/styles.css'
    import { onNavigate } from '$app/navigation'

    import appState from '$lib/appState.svelte'
    import Hero from '$lib/hero/Hero.svelte'
    import Header from './Header.svelte'

    let { children } = $props()

    onNavigate((navigation) => {
        document.body.scrollTo(0, 0)

        if (!document.startViewTransition) return

        return new Promise((resolve) => {
            document.startViewTransition(async () => {
                resolve()
                await navigation.complete
            })
        })
    })
</script>

<Header />

<Hero title={appState.title} />

<div class="page-content" class:ready={appState.ready}>
    {@render children()}
</div>

<style>
    .page-content {
        position: relative;
        z-index: 1;

        transition: margin-top 500ms ease-out 1.3s;
    }

    .page-content.ready {
        margin-top: -5rem;
    }
</style>
